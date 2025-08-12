//src/configs/domain/index.js
import dotenv from "dotenv";
dotenv.config();
const configMap = {
  "localhost:3000": {
    DATABASE_URI: process.env.MONGODB_URI_LOCAL,
    DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK_URL_LOCAL,
    JWT_SECRET: process.env.JWT_SECRET_LOCAL,
    JWT_SECRET_RERESH: process.env.JWT_SECRET_RERESH_LOCAL,
    HOST: process.env.HOST,
    EMAIL_USER: process.env.EMAIL_USER_LOCAL,
    EMAIL_PASS: process.env.EMAIL_PASS_LOCAL,
    FRONTEND_NAME: "local",
    DOMAIN: process.env.DOMAIN,
    PROMPT: `Nội dung phải CHUYÊN SÂU:
   - bài viết dài khoảng 4000 - 4500 từ
   - Ngành viết về dịch vụ đặt xe : xe ôm , taxi , giao hàng
   - dùng thông tin về địa phương như các huyện , tỉnh , phường , xã , thành phố và các địa điểm nổi tiếng , các danh lam thắng cảnh để viết chuyên sâu có thể sử dụng mỗi địa phương làm 1 tiêu đề phụ
   - Có ví dụ thực tế, số liệu, và nghiên cứu liên quan.
   - Dùng các thẻ H2, H3, H4 để phân chia nội dung rõ ràng.
   - Dùng thêm các icon để làm nổi bật nội dung, ví dụ: 🚗, 🏞️, 📊, 💡, 🔍.
   - Dùng các thương hiệu tương tự như XanhSM, Grab, Be, Vinasun để phân tích nội dung.
   - Tags phải liên quan đến nội dung và từ khóa chính, ví dụ từ khóa "grab dĩ an" sẽ có tags: ["grab dĩ an", "grab bình an","grab bình thắng","xanh sm dĩ an","grab tân đông hiệp"].
   - Một số thông tin su dung trong content:
      + Số điện thoại 0327883039
      + Website: https://datxenhanh-24h.pro.vn
      + Có thể đặt xe qua biểu mẫu trong website ( nhap diem don, diem den, loai xe , so dien thoai )
   - nếu có thể hãy sử dụng bảng giá cước tham khảo   
    `,
  },
  "datxetietkiem.com": {
    DATABASE_URI: process.env.MONGODB_URI_DUYHAI,
    DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK_URL_DUYHAI,
    JWT_SECRET: process.env.JWT_SECRET_DUYHAI,
    JWT_SECRET_RERESH: process.env.JWT_SECRET_RERESH_DUYHAI,
    HOST: process.env.HOST,
    EMAIL_USER: process.env.EMAIL_USER_DUYHAI,
    EMAIL_PASS: process.env.EMAIL_PASS_DUYHAI,
    FRONTEND_NAME: "duyhaiweb",
    DOMAIN: process.env.DOMAIN_DUYHAI,
    PROMPT: `Nội dung phải CHUYÊN SÂU:
   - bài viết dài khoảng 4000 - 4500 từ
   - Ngành viết về dịch vụ đặt xe : xe ôm , taxi , giao hàng
   - dùng thông tin về địa phương như các huyện , tỉnh , phường , xã , thành phố và các địa điểm nổi tiếng , các danh lam thắng cảnh để viết chuyên sâu có thể sử dụng mỗi địa phương làm 1 tiêu đề phụ
   - Có ví dụ thực tế, số liệu, và nghiên cứu liên quan.
   - Dùng các thẻ H2, H3, H4 để phân chia nội dung rõ ràng.
   - Dùng thêm các icon để làm nổi bật nội dung, ví dụ: 🚗, 🏞️, 📊, 💡, 🔍.
   - Dùng các thương hiệu tương tự như XanhSM, Grab, Be, Vinasun để phân tích nội dung.
   - Tags phải liên quan đến nội dung và từ khóa chính, ví dụ từ khóa "grab dĩ an" sẽ có tags: ["grab dĩ an", "grab bình an","grab bình thắng","xanh sm dĩ an","grab tân đông hiệp"].
   - Một số thông tin su dung trong content:
      + Số điện thoại 0327883039
      + Website: https://datxetietkiem.com
      + Có thể đặt xe qua biểu mẫu trong website ( nhap diem don, diem den, loai xe , so dien thoai )
   - nếu có thể hãy sử dụng bảng giá cước tham khảo   
    `,
  },
  "taxinhanh247.pro.vn": {
    DATABASE_URI: process.env.MONGODB_URI_TAXINHANH,
    DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK_URL_TAXINHANH,
    JWT_SECRET: process.env.JWT_SECRET_TAXINHANH,
    JWT_SECRET_RERESH: process.env.JWT_SECRET_RERESH_TAXINHANH,
    HOST: process.env.HOST,
    EMAIL_USER: process.env.EMAIL_USER_TAXINHANH,
    EMAIL_PASS: process.env.EMAIL_PASS_TAXINHANH,
    FRONTEND_NAME: "taxinhanh247.pro.vn",
    DOMAIN: process.env.DOMAIN_TAXINHANH,
    PROMPT: `Nội dung phải CHUYÊN SÂU:
   - bài viết dài khoảng 4000 - 4500 từ
   - Ngành viết về dịch vụ đặt xe : xe ôm , taxi , giao hàng
   - dùng thông tin về địa phương như các huyện , tỉnh , phường , xã , thành phố và các địa điểm nổi tiếng , các danh lam thắng cảnh để viết chuyên sâu có thể sử dụng mỗi địa phương làm 1 tiêu đề phụ
   - Có ví dụ thực tế, số liệu, và nghiên cứu liên quan.
   - Dùng các thẻ H2, H3, H4 để phân chia nội dung rõ ràng.
   - Dùng thêm các icon để làm nổi bật nội dung, ví dụ: 🚗, 🏞️, 📊, 💡, 🔍.
   - Dùng các thương hiệu tương tự như XanhSM, Grab, Be, Vinasun để phân tích nội dung.
   - Tags phải liên quan đến nội dung và từ khóa chính, ví dụ từ khóa "grab dĩ an" sẽ có tags: ["grab dĩ an", "grab bình an","grab bình thắng","xanh sm dĩ an","grab tân đông hiệp"].
   - Một số thông tin su dung trong content:
      + Số điện thoại 0327883039
      + Website: https://taxinhanh247.pro.vn
      + Có thể đặt xe qua biểu mẫu trong website ( nhap diem don, diem den, loai xe , so dien thoai )
   - nếu có thể hãy sử dụng bảng giá cước tham khảo   
    `,
  },
  "datxenhanh-24h.pro.vn": {
    DATABASE_URI: process.env.MONGODB_URI_DATXENHANH_24H_PRO_VN,
    DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK_URL_DATXENHANH_24H_PRO_VN,
    JWT_SECRET: process.env.JWT_SECRET_DATXENHANH_24H_PRO_VN,
    JWT_SECRET_RERESH: process.env.JWT_SECRET_RERESH_DATXENHANH_24H_PRO_VN,
    HOST: process.env.HOST,
    EMAIL_USER: process.env.EMAIL_USER_DATXENHANH_24H_PRO_VN,
    EMAIL_PASS: process.env.EMAIL_PASS_DATXENHANH_24H_PRO_VN,
    FRONTEND_NAME: "datxenhanh-24h.pro.vn",
    DOMAIN: process.env.DOMAIN_DATXENHANH_24H_PRO_VN,
    PROMPT: `Nội dung phải CHUYÊN SÂU:
   - bài viết dài khoảng 4000 - 4500 từ
   - Ngành viết về dịch vụ đặt xe : xe ôm , taxi , giao hàng
   - dùng thông tin về địa phương như các huyện , tỉnh , phường , xã , thành phố và các địa điểm nổi tiếng , các danh lam thắng cảnh để viết chuyên sâu có thể sử dụng mỗi địa phương làm 1 tiêu đề phụ
   - Có ví dụ thực tế, số liệu, và nghiên cứu liên quan.
   - Dùng các thẻ H2, H3, H4 để phân chia nội dung rõ ràng.
   - Dùng thêm các icon để làm nổi bật nội dung, ví dụ: 🚗, 🏞️, 📊, 💡, 🔍.
   - Dùng các thương hiệu tương tự như XanhSM, Grab, Be, Vinasun để phân tích nội dung.
   - Tags phải liên quan đến nội dung và từ khóa chính, ví dụ từ khóa "grab dĩ an" sẽ có tags: ["grab dĩ an", "grab bình an","grab bình thắng","xanh sm dĩ an","grab tân đông hiệp"].
   - Một số thông tin su dung trong content:
      + Số điện thoại 0327883039
      + Website: https://datxenhanh-24h.pro.vn
      + Có thể đặt xe qua biểu mẫu trong website ( nhap diem don, diem den, loai xe , so dien thoai )
   - nếu có thể hãy sử dụng bảng giá cước tham khảo   
    `,
  },
};
export default configMap;
