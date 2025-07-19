import configMap from "../configs/domain/index.js";
import { getDbConnection } from "../configs/database/mongoConnectionPool.js";

export async function configPerDomain(req, res, next) {
  const host = req.headers.host;
  const origin = req.headers.origin;

  // Kiểm tra theo host
  let config = configMap[host];

  // Nếu không tìm thấy theo host thì thử với origin (loại bỏ protocol)
  if (!config && origin) {
    console.log("không khớp host :", host);
    try {
      const originHost = new URL(origin).host;
      config = configMap[originHost];
    } catch (err) {
      console.error("Invalid origin URL:", origin);
    }
  }

  if (!config) {
    return res.status(400).json({
      message: `Domain unknown: ${host}${origin ? ` or ${origin}` : ""}`,
    });
  }

  // Gắn config
  req.app.locals.config = config;

  // Kết nối DB cho domain tương ứng
  try {
    req.db = await getDbConnection(config.DATABASE_URI);
    next();
  } catch (err) {
    console.error("DB Connection error:", err.message);
    res.status(500).json({ message: "Cannot connect to database" });
  }
}
