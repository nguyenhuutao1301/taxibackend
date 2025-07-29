const rawCredentials = process.env.GOOGLE_CREDENTIALS;
import { getPostModel } from "../models/PostModal.js";
import { google } from "googleapis";

if (!rawCredentials) {
  throw new Error("Thiếu biến môi trường GOOGLE_CREDENTIALS");
}

// Parse chuỗi JSON thành object
const key = JSON.parse(rawCredentials);

const SCOPES = ["https://www.googleapis.com/auth/indexing"];

const jwtClient = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: SCOPES,
});

const indexing = google.indexing({
  version: "v3",
  auth: jwtClient,
});
class GoogleController {
  postIndexUrl = async (req, res) => {
    const Post = getPostModel(req.db);
    const { url, type = "URL_UPDATED" } = req.body;

    if (!url) {
      return res.status(400).json({ message: "Thiếu URL cần index." });
    }

    try {
      const response = await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type, // "URL_UPDATED" hoặc "URL_DELETED"
        },
      });
      if (response.status !== 200) {
        return res.status(response.status).json({
          message: "Lỗi khi gửi yêu cầu index.",
          error: response.data,
        });
      }
      // Cập nhật trạng thái index trong cơ sở dữ liệu
      await Post.updateOne({ url }, { $set: { indexed: true } });

      return res.status(200).json({
        message: "Đã gửi yêu cầu index thành công.",
        data: response.data,
      });
    } catch (error) {
      console.error("Lỗi gửi Indexing API:", error.message);
      return res.status(500).json({ message: "Lỗi gửi Indexing API", error });
    }
  };
}
export default new GoogleController();
