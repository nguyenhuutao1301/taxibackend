import express from "express";
import morgan from "morgan";
const app = express();

import route from "./routes/index.js";
import cors from "cors";
// import connectDB from "./configs/database/index.js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const port = process.env.PORT || 3002;
import { configPerDomain } from "./middleware/configPerDomain.js";
import cookieParser from "cookie-parser";
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// connect database mongoose
// connectDB();
// // Middleware

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
    extended: true,
  })
);
// middleware  quản lý lỗi đồng nhất

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Lỗi server",
  });
});
const allowedOrigins = [
  "https://goixegiare.pro.vn",
  "https://xegrabdongnai.pro.vn",
  "https://taxifrontend.vercel.app",
  "https://taxinhanh247.pro.vn",
  "http://localhost:3000",
];
// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép khi không có origin (như từ cURL hoặc Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
//config domain
app.use(configPerDomain);
app.use(express.json({ limit: "50mb" }));
// using morgan
app.use(morgan("combined"));
// route
route(app);
// app listen
app.listen(port, () => {
  console.log(`Sever listening on port ${port}`);
});
// app test
app.get("/info", (req, res) => {
  const cfg = req.app.locals.config;
  res.json({
    frontend: cfg.FRONTEND_NAME,
    db: cfg.DATABASE_URI,
    discord: cfg.DISCORD_WEBHOOK,
  });
});
