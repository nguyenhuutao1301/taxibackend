import configMap from "../configs/domain/index.js";
import { getDbConnection } from "../configs/database/mongoConnectionPool.js";

export async function configPerDomain(req, res, next) {
  const host = req.headers.origin;
  const config = configMap[host];

  if (!config)
    return res.status(400).json({ message: "Domain unknown: " + host });

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
