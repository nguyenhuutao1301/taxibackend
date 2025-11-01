import axios from "axios";
import { parseStringPromise } from "xml2js";
import pLimit from "p-limit";
import { crawlArticleData } from "../../utils/crawlHelper.js";
import { getPostModel } from "../models/post.models.js";
import { getSettingModel } from "../models/setting.models.js";
import { cleanContent } from "../../utils/cleanContent.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * Crawl bài viết từ sitemap và lưu vào database.
 * Gọi qua API: POST /api/crawl
 */
const generateSlug = (title) => {
  const from = "àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ";
  const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";

  const newTitle = title
    .toLowerCase()
    .split("")
    .map((char) => {
      const i = from.indexOf(char);
      return i !== -1 ? to[i] : char;
    })
    .join("");

  return newTitle.replace(/ /g, "-").replace(/[^\w-]+/g, "");
};
export const crawlFromSitemapController = async (req, res) => {
  const { url: customUrl, defautphone } = req.body || {};
  const sitemapUrl = customUrl;

  if (!sitemapUrl) {
    return res.status(400).json({ success: false, message: "Thiếu URL sitemap" });
  }

  const db = req.db; // nếu bạn dùng middleware attach db
  const Post = getPostModel(db);
  const Setting = getSettingModel(db);

  const limit = pLimit(5); // giới hạn 5 request song song
  console.log(`🚀 Bắt đầu crawl từ sitemap: ${sitemapUrl}`);
  try {
    // 🧭 Lấy toàn bộ URL từ sitemap
    async function getUrlsFromSitemap(sitemapUrl) {
      try {
        const { data } = await axios.get(sitemapUrl);
        const parsed = await parseStringPromise(data);

        if (parsed.sitemapindex) {
          const sitemaps = parsed.sitemapindex.sitemap.map((s) => s.loc[0]);
          console.log(`📂 Sitemap chính chứa ${sitemaps.length} sitemap con.`);
          let allUrls = [];
          for (const sm of sitemaps) {
            const urls = await getUrlsFromSitemap(sm);
            allUrls = [...allUrls, ...urls];
          }
          return allUrls;
        }

        // Sitemap bài viết
        const urls = parsed.urlset.url.map((item) => item.loc[0]);
        return urls;
      } catch (err) {
        console.error("❌ Lỗi đọc sitemap:", sitemapUrl, err.message);
        return [];
      }
    }

    // 🧩 Bắt đầu crawl
    const urls = await getUrlsFromSitemap(sitemapUrl);
    console.log(`🔍 Tìm thấy ${urls.length} bài viết.`);
    let count = 0;
    await Promise.all(
      urls.map((url) =>
        limit(async () => {
          try {
            const slug = url.split("/").filter(Boolean).pop();
            const existing = await Post.findOne({ slug });
            if (existing) {
              console.log(`⏩ Bỏ qua (đã có): ${url}`);
              return;
            }

            const data = await crawlArticleData(url);

            if (!data?.title || !data?.content) {
              console.log(`⚠️ Bỏ qua (thiếu dữ liệu): ${url}`);
              return;
            }

            // Tạo bài viết
            const post = new Post({
              title: data.title,
              description: data.description || data.title,
              slug: generateSlug(data.title) || data.slug,
              content: cleanContent(data.content),
              authorName: data.authorName || "Cường Tổng Đài Đặt Xe",
              authorUrl: data.authorUrl || "/profile/6905c52e88aabc72ed51aa47",
              publishedDate: new Date(),
              image: {
                url: data.image || "",
                alt: data.title || "",
              },
              tags: data.tags || ["grab", "goixe", "taxi", "taxi online"],
              likes: [],
              breadcrumbs: data.breadcrumbs || [
                { name: "Trang Chủ", url: "/" },
                { name: "Blogs", url: "/bai-viet" },
              ],
            });

            await post.save();
            count++;
            console.log(`✅ Lưu thành công: ${data.title}`);

            // Nếu có default phone thì lưu Setting
            if (defautphone) {
              await new Setting({
                slug: post.slug,
                numberphone: defautphone,
              }).save();
              console.log(`✅ Config phone: ${data.title}`);
            }
          } catch (err) {
            console.error("❌ Lỗi khi crawl:", url, err.message);
          }
        })
      )
    );

    return res.status(200).json({
      success: true,
      message: `Crawl hoàn tất ${count} bài viết mới.`,
    });
  } catch (err) {
    console.error("❌ Lỗi tổng:", err);
    return res.status(500).json({ success: false, message: "Lỗi crawl sitemap" });
  }
};

export const convertCrawledContentController = async (req, res) => {
  const Post = getPostModel(req.db);
  const config = req.app.locals.config;
  try {
    const cursor = Post.find({}).select("title content slug").cursor();

    let updatedCount = 0;

    for await (const post of cursor) {
      const cleanedContent = cleanContent(post.content);
      if (cleanedContent !== post.content) {
        post.content = cleanedContent;
        await post.save();
        updatedCount++;
        try {
          await fetch(`${config.DOMAIN}/api/revalidate/post?slug=${post.slug}&secret=${process.env.REVALIDATE_SECRET}`);
          console.log("✅ Vercal render:", post.title);
        } catch (err) {
          console.error("Revalidate error:", err);
        }
        console.log(`✅ Cập nhật bài viết: ${post.title}`);
      } else {
        console.log(`⏩ Bài viết không cần cập nhật: ${post.title}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Đã cập nhật nội dung sạch cho ${updatedCount} bài viết.`,
    });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật nội dung:", err);
    return res.status(500).json({ success: false, message: "Lỗi cập nhật nội dung" });
  }
};
