import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import route from "./routes/index.route.js";
import { configPerDomain } from "./middleware/configPerDomain.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Lấy __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trust proxy (nếu dùng nginx / proxy)
app.set("trust proxy", true);

// ⏱ Timeout cho toàn bộ request (5 phút)
app.use((req, res, next) => {
  res.setTimeout(18000000, () => {
    console.error("⏱ Request timeout.");
    if (!res.headersSent) {
      res.status(408).json({ message: "Request Timeout" });
    }
  });
  next();
});

// Middleware parse body trước tiên
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
//CORS DEBUG
app.use((req, res, next) => {
  console.log("🛰️ [CORS DEBUG]");
  console.log("Method:", req.method);
  console.log("Origin:", req.headers.origin);
  console.log("Host:", req.headers.host);
  console.log("Path:", req.originalUrl);
  console.log("--------------------------------------------------");
  next();
});

// CORS

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Cho phép Postman/cURL

      const allowedOrigins = [
        "https://goixegiare.pro.vn",
        "https://xegrabdongnai.pro.vn",
        "https://taxinhanh247.pro.vn",
        "https://datxenhanh-24h.pro.vn",
        "https://datxetietkiem.com",
        "https://taxisieure.com",
        "https://www.taxisieure.com",
        "https://hotrodatxesieure.com",
        "https://www.hotrodatxesieure.com",
        "https://tongdatdatxe24gio.top",
        "http://localhost:3000",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  })
);

// Cookie parser
app.use(cookieParser());

// Static file
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Middleware config domain (sau khi đã parse JSON & cors)
app.use(configPerDomain);

// Logging
app.use(morgan("combined"));
// Routes
route(app);

// Middleware bắt lỗi đặt CUỐI CÙNG
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Lỗi server",
  });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
