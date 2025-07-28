import express from "express";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// 👇 Tạo __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEY_PATH = path.join(
  __dirname,
  "../google/meta-plateau-467315-g1-ad931dbd8116.json"
);
const SCOPES = ["https://www.googleapis.com/auth/indexing"];

const key = JSON.parse(fs.readFileSync(KEY_PATH, "utf8"));

const jwtClient = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: SCOPES,
});

const indexing = google.indexing({
  version: "v3",
  auth: jwtClient,
});

// POST /api/index-url
router.post("/index-url", async (req, res) => {
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

    return res.status(200).json({
      message: "Đã gửi yêu cầu index thành công.",
      data: response.data,
    });
  } catch (error) {
    console.error("Lỗi gửi Indexing API:", error.message);
    return res.status(500).json({ message: "Lỗi gửi Indexing API", error });
  }
});
export default router;
