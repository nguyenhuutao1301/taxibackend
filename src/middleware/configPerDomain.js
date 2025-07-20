import configMap from "../configs/domain/index.js";
import { getDbConnection } from "../configs/database/mongoConnectionPool.js";

export async function configPerDomain(req, res, next) {
  const { referer, origin, host } = req.headers;
  let domainKey;

  if (referer) {
    try {
      domainKey = new URL(referer).host;
    } catch (err) {
      console.error("Invalid referer URL:", referer);
    }
  }

  if (!domainKey && origin) {
    try {
      domainKey = new URL(origin).host;
    } catch (err) {
      console.error("Invalid origin URL:", origin);
    }
  }

  if (!domainKey) {
    domainKey = host;
  }

  const config = configMap[domainKey]; // ⬅️ lỗi xảy ra nếu configMap không được import

  if (!config) {
    return res.status(400).json({ message: `Domain unknown: ${domainKey}` });
  }

  req.app.locals.config = config;

  try {
    req.db = await getDbConnection(config.DATABASE_URI);
    next();
  } catch (err) {
    console.error("DB Connection error:", err.message);
    res.status(500).json({ message: "Cannot connect to database" });
  }
}
