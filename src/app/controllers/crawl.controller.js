import axios from "axios";
import { parseStringPromise } from "xml2js";
import pLimit from "p-limit";
import { crawlArticleData } from "../../utils/crawlHelper.js";
import { getPostModel } from "../models/post.models.js";

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
  const { url: customUrl } = req.body || {};
  const sitemapUrl = customUrl;

  if (!sitemapUrl) {
    return res.status(400).json({ success: false, message: "Thiếu URL sitemap" });
  }

  const db = req.db; // nếu bạn dùng middleware attach db
  const Post = getPostModel(db);

  const limit = pLimit(5); // giới hạn 5 request song song

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
            const existing = await Post.findOne({ slug: url.split("/").filter(Boolean).pop() });
            if (existing) {
              console.log(`⏩ Bỏ qua (đã có): ${url}`);
              return;
            }

            const data = await crawlArticleData(url);

            // Chuẩn hóa dữ liệu để phù hợp với Post model
            if (data && data.title && data.content) {
              const post = new Post({
                title: data.title,
                description: data.description || data.title,
                slug: generateSlug(data.title) || data.slug,
                content: data.content,
                authorName: data.authorName || "Nguồn khác",
                authorUrl: data.authorUrl || "/profile/68b54477357138f28d16d110",
                publishedDate: new Date(),
                image: {
                  url: data.image || "",
                  alt: data.title || "",
                },
                tags: data.tags || [],
                likes: [],
                breadcrumbs: data.breadcrumbs || [
                  { name: "Trang Chủ", url: "/" },
                  { name: "Blogs", url: "/bai-viet" },
                ],
              });

              await post.save();
              count++;
              console.log(`✅ Lưu thành công: ${data.title}`);
            } else {
              console.log(`⚠️ Bỏ qua (thiếu dữ liệu): ${url}`);
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
