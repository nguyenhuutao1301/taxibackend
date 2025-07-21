import { UAParser } from "ua-parser-js";
import { getTrafficModel } from "../models/TrafficModals.js";
import { sendDiscordMessage } from "../../helpers/discord/index.js";
import { isbot } from "isbot";
class TrafficController {
  createTraffic = async (req, res) => {
    const config = req.app.locals.config;
    const Traffic = getTrafficModel(req.db);
    try {
      const { lat, lon, referrer, userAgent, visitorId } = req.body || {};

      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket?.remoteAddress ||
        "unknown";

      const parser = new UAParser(userAgent || "");
      const browser = parser.getBrowser().name || "unknown";
      const deviceInfo = parser.getDevice();
      const device = deviceInfo.model
        ? `${deviceInfo.vendor || "android"} ${deviceInfo.model}`
        : "Desktop";

      const isBotUser = isbot(userAgent || "");
      const existing = await Traffic.findOne({ visitorId });

      if (existing) {
        existing.times += 1;
        existing.ref = referrer ?? "/";
        existing.historyIp.push(ip);
        existing.historyTimestamps.push(new Date());
        existing.historyLocation.push(
          lat && lon
            ? `https://www.google.com/place/${lat},${lon}`
            : "không lấy được vị trí"
        );
        existing.historyRef.push(referrer || "unknown");
        await existing.save();
        console.log("🟡 Visitor đã tồn tại - Cập nhật traffic:", visitorId);

        if (!isBotUser) {
          await sendDiscordMessage({
            ip,
            lat,
            lon,
            referrer,
            device,
            browser,
            userAgent,
            DISCORD_WEBHOOK_URL: config.DISCORD_WEBHOOK,
          });
        }

        return res.status(200).json({ message: "Visitor updated", existing });
      }
      const data = {
        visitorId,
        Ip: ip,
        isBot: isBotUser,
        ref: referrer || "/",
        browser,
        isAds: referrer?.includes("ads") ?? false,
        device,
        location:
          lat && lon
            ? `https://www.google.com/maps/place/${lat},${lon}`
            : "không lấy được vị trí",
        times: 1,
        historyIp: [ip],
        historyRef: referrer ? [referrer] : ["unknown"],
        historyLocation:
          lat && lon
            ? [`https://www.google.com/maps/place/${lat},${lon}`]
            : ["không lấy được vị trí"],
        historyTimestamps: [new Date()],
      };

      const newTraffic = new Traffic(data);
      const saved = await newTraffic.save();

      console.log("🟢 New visitor saved:", saved);

      if (!isBotUser) {
        await sendDiscordMessage({
          ip,
          lat,
          lon,
          referrer,
          device,
          browser,
          userAgent,
          DISCORD_WEBHOOK_URL: config.DISCORD_WEBHOOK,
        });
      }

      return res
        .status(200)
        .json({ message: "New visitor tracked", newTraffic: saved });
    } catch (err) {
      console.error("❌ Error tracking traffic:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  getTraffic = async (req, res) => {
    const Traffic = getTrafficModel(req.db);
    try {
      const data = await Traffic.find()
        .select("Ip isAds isBot updatedAt times ref _id")
        .sort({ updatedAt: -1 }) // ✅ sắp xếp theo bản ghi mới nhất
        .limit(500);
      if (!data || data.length === 0) {
        return res.status(404).json({ message: "no traffic data found" });
      }
      return res.json({ success: true, result: data });
    } catch (err) {
      console.error("❌ Error fetching traffic:", err);
      return res.status(500).json({ error: "Failed to fetch traffic" });
    }
  };
  getTrafficById = async (req, res) => {
    const config = req.app.locals.config;
    const Traffic = getTrafficModel(req.db);
    const _id = req.query.id;
    if (!_id) {
      console.log("get traffic by id : ", _id);
      return res.status(404).json({
        success: false,
        message: "not found id",
      });
    }
    try {
      const trafficId = await Traffic.findById(_id);
      if (!trafficId) {
        return res.status(404).json({
          success: false,
          message: "not found data",
        });
      }
      return res.status(200).json({
        success: true,
        message: "success",
        result: trafficId,
      });
    } catch (error) {
      console.log("error catch:", error);
      return res.status(500).json({
        success: false,
        message: "catch error",
      });
    }
  };
}
export default new TrafficController();
