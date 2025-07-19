export async function configPerDomain(req, res, next) {
  const { referer, origin, host } = req.headers;
  let domainKey;

  // Ưu tiên referer (luôn có ở mọi loại request từ frontend)
  if (referer) {
    try {
      domainKey = new URL(referer).host;
    } catch (err) {
      console.error("Invalid referer URL:", referer);
    }
  }

  // Nếu không có referer, thử đến origin
  if (!domainKey && origin) {
    try {
      domainKey = new URL(origin).host;
    } catch (err) {
      console.error("Invalid origin URL:", origin);
    }
  }

  // Nếu vẫn không có, fallback sang host (domain API)
  if (!domainKey) {
    domainKey = host;
  }

  const config = configMap[domainKey];

  if (!config) {
    console.warn("Không tìm thấy config cho domain:", domainKey);
    return res.status(400).json({
      message: `Domain unknown: ${domainKey}`,
    });
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
