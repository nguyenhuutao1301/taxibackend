import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class OpenAiController {
  // [POST] /api/openai/generate-post
  generatePost = async (req, res) => {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ message: "Thiếu prompt" });
    }
    const prompt = `
Bạn là chuyên gia SEO và copywriting chuyên nghiệp. 
Hãy viết một bài viết CHUYÊN SÂU với độ dài khoảng 4000 từ, đảm bảo tối ưu SEO và phù hợp với độc giả Việt Nam.

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

4. Nội dung phải CHUYÊN SÂU:
   - Phân tích, so sánh, nêu ưu nhược điểm.
   - sử dụng thông tin địa phương và ngôn ngữ phù hợp với độc giả Việt Nam.
   - dùng các danh lam thắng cảnh và các xã , huyện , tỉnh , thành phố để phân tích nội dung
   - Có ví dụ thực tế, số liệu, và nghiên cứu liên quan.
   - Có lời khuyên, mẹo, và kết luận rõ ràng.
   - Có thể chia thành 10-15 mục lớn với các heading phù hợp.
   - dung các thẻ H2, H3, H4 để phân chia nội dung rõ ràng.
   - dùng thêm các icon để làm nổi bật nội dung, ví dụ: 🚗, 🏞️, 📊, 💡, 🔍.
   - dùng các dịch vụ tương tự như xanhsm, grab,bee,vinasun, để phân tích nội dung 
   - tags phải liên quan đến nội dung và từ khóa chính, ví dụ từ khóa "grab dĩ an" sẽ có tags: ["grab xe máy dĩ an", "grab bình an dĩ an","grab bình thắng dĩ an","xanh sm dĩ an","grab tân đông hiệp"].
   - một số thông tin thêm : 
    + số điện thoại 0336488240
    + website : https://datxenhanh-24h.pro.vn
    + có thể đặt xe qua biểu mẫu trong website
6. Trả về **chỉ** JSON hợp lệ, không có bất kỳ ký tự hoặc định dạng nào khác.`;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      let aiText = result.response.candidates[0].content.parts[0].text.trim();
      aiText = aiText.replace(/```json|```/g, "").trim();
      console.log("AI Text:", aiText);
      return res.status(200).json({
        message: "Tạo bài viết thành công",
        result: JSON.parse(aiText),
        success: true,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi tạo bài viết", error: error.message });
    }
  };
}
export default new OpenAiController();
