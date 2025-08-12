import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Đặt key trong biến môi trường
});

class OpenAiController {
  // [POST] /api/openai/generate-post
  generatePost = async (req, res) => {
    const { keyword } = req.body;
    const config = req.app.locals.config;
    const Domain = config.DOMAIN || "datxenhanh-24h.pro.vn";
    const promptCustom = config.PROMPT || "";
    if (!keyword) {
      return res.status(400).json({ message: "Thiếu từ khóa chính" });
    }

    const prompt = `
Bạn là chuyên gia SEO chuyên nghiệp. 
Hãy viết một bài viết CHUYÊN SÂU cho website ${Domain}, đảm bảo tối ưu SEO và phù hợp với độc giả Việt Nam.

Yêu cầu:
1. Nội dung phải chi tiết, đầy đủ, và có cấu trúc rõ ràng với các thẻ H2, H3, H4.
2. Từ khóa chính: "${keyword}" — từ khóa này phải xuất hiện tự nhiên trong tiêu đề, mô tả và rải đều trong bài.
3. Trả về dữ liệu theo **định dạng JSON**:
{
  "title": "Tiêu đề hấp dẫn chứa từ khóa chính",
  "description": "Đoạn mô tả ngắn chuẩn SEO (155-160 ký tự) chứa từ khóa chính",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "slug": "tieu-de-hap-dan-chua-tu-khoa-chinh",
  "content": "<h2>Giới thiệu</h2><p>...</p><h2>Mục 1</h2><p>...</p>..."
}
4.${promptCustom}
6. Trả về **chỉ** JSON hợp lệ, không có bất kỳ ký tự hoặc định dạng nào khác.
`;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content:
              "Bạn là một chuyên gia SEO chuyên nghiệp, viết nội dung tối ưu Google.",
          },
          { role: "user", content: prompt },
        ],
      });

      let aiText = completion.choices[0].message.content.trim();

      // Loại bỏ khối ```json ``` nếu có
      aiText = aiText.replace(/```json|```/g, "").trim();

      return res.status(200).json({
        message: "Tạo bài viết thành công",
        result: JSON.parse(aiText),
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi tạo bài viết",
        error: error.message,
      });
    }
  };
}

export default new OpenAiController();
