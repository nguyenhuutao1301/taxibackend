// src/controllers/openAi.controller.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Hàm gọi GPT-5-mini với timeout & retry
 */
async function callGPT(prompt) {
  const res = await openai.responses.create({
    model: "gpt-5-nano", // GPT-5-nano
    input: prompt,
  });
  console.log(res.output_text);
  return res.output_text;
}

/**
 * Prompt metadata
 */
function buildMetaPrompt(numberWord, keyword, promptCustom) {
  return `
Bạn là chuyên gia SEO. Viết metadata & outline cho bài viết nội dung ${numberWord} từ .
Từ khóa chính: "${keyword}"

Trả về JSON:
{
  "title": "Tiêu đề chứa từ khóa",
  "description": "Mô tả ngắn 155-160 ký tự chứa từ khóa",
  "tags": ["tag1", "tag2", "tag3"],
  "slug": "slug-chua-tu-khoa",
  "outline": ["Mục 1", "Mục 2", "Mục 3", "..."]
}
${promptCustom || ""}
-tags phải liên quan đến từ khóa chính ví dụ grab đồng nai sẽ có tag ["grab biên hòa","grab long thành","đặt taxi vinasun đồng nai"
Chỉ trả JSON hợp lệ. không trả thêm bất cữ dữ liệu nào khác
`;
}

/**
 * Prompt viết nhiều section cùng lúc
 */
function buildBatchSectionPrompt(outline, keyword, domain, numberWord) {
  return `
Bạn là chuyên gia SEO. Viết nội dung CHUYÊN SÂU cho website ${domain}.
Từ khóa: "${keyword}"

Outline:
${outline.map((title, i) => `${i + 1}. ${title}`).join("\n")}

Yêu cầu:
- Mỗi mục 100 - 500 từ, thẻ H2/H3 rõ ràng.
- tổng thể dữ liệu dữ liệu trả về không vượt quá ${numberWord} từ
- Nội dung khác nhau, không trùng lặp.
- Chèn icon nếu phù hợp.
- sử dụng tags html semantic ul,li,table,...
- Trả về JSON dạng:
{
  "sections": [
    {"title": "Mục 1", "content": "<h2>...</h2><p>...</p>"},
    ...
  ]
}
Chỉ trả JSON hợp lệ.không trả thêm dữ liệu không liên quan
`;
}

/**
 * Controller chính
 */
class OpenAiController {
  async generatePost(req, res) {
    try {
      const { keyword } = req.body;
      const {
        DOMAIN: domain,
        PROMPT: promptCustom,
        numberWord: numberWord,
      } = req.app.locals.config || {};

      if (!keyword || !domain) {
        return res.status(400).json({ message: "Thiếu keyword hoặc domain" });
      }

      // 1️⃣ Lấy metadata
      const metaPrompt = buildMetaPrompt(numberWord, keyword, promptCustom);
      const metaText = await callGPT(metaPrompt);
      let meta;
      try {
        meta = JSON.parse(metaText);
      } catch {
        return res
          .status(500)
          .json({ message: "Lỗi parse metadata", raw: metaText });
      }

      // 2️⃣ Viết tất cả section trong 1 request
      const batchPrompt = buildBatchSectionPrompt(
        meta.outline,
        keyword,
        domain,
        numberWord
      );
      const batchText = await callGPT(batchPrompt);
      let sections;
      try {
        sections = JSON.parse(batchText).sections;
      } catch {
        return res
          .status(500)
          .json({ message: "Lỗi parse sections", raw: batchText });
      }

      const fullContent = sections.map((sec) => sec.content).join("\n\n");

      // 3️⃣ Trả kết quả
      return res.status(200).json({
        message: "Tạo bài viết thành công",
        result: {
          title: meta.title,
          description: meta.description,
          tags: meta.tags,
          slug: meta.slug,
          content: fullContent,
        },
        success: true,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi tạo bài viết", error: error.message });
    }
  }
}

export default new OpenAiController();
