import { UAParser } from "ua-parser-js";
import { getTrafficModel } from "../models/traffic.models.js";
import { getSettingModel } from "../models/setting.models.js";
import { sendDiscordMessage } from "../../helpers/discord/index.js";
import { isbot } from "isbot";
class TrafficController {
  createTraffic = async (req, res) => {
    const config = req.app.locals.config;
    const Traffic = getTrafficModel(req.db);
    const Settings = getSettingModel(req.db);

    const ipBot = ["72.14.199"];

    try {
      const { lat, lon, referrer, userAgent, visitorId, slug } = req.body || {};

      const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown";

      const parser = new UAParser(userAgent || "");
      const browser = parser.getBrowser().name || "unknown";
      const deviceInfo = parser.getDevice();
      const device = deviceInfo.model ? `${deviceInfo.vendor || "android"} ${deviceInfo.model}` : "Desktop";

      const isBotUser = isbot(userAgent || "");

      const existing = await Traffic.findOne({ visitorId });

      const isIpBlocked = (ip, blocked) =>
        blocked.some((rule) => (rule.split(".").length < 4 ? ip.startsWith(rule + ".") : ip === rule));

      const shouldSendDiscord = async () => {
        // ❌ bot thì không gửi
        if (isBotUser) return false;

        // ❌ IP bị block thì không gửi
        if (isIpBlocked(ip, ipBot)) return false;

        // 🔍 tìm setting theo slug
        const setting = await Settings.findOne({ slug });

        // ✅ KHÔNG có setting → mặc định BẬT thông báo
        if (!setting) return true;

        // 🚫 notificationDiscord = true → TẮT thông báo
        if (setting.notificationDiscord === true) return false;

        // ✅ notificationDiscord = false → BẬT thông báo
        return true;
      };

      /* ================= VISITOR EXIST ================= */

      if (existing) {
        existing.times += 1;
        existing.ref = referrer;
        existing.historyIp.push(ip);
        existing.historyTimestamps.push(new Date());
        existing.historyLocation.push(
          lat && lon ? `https://www.google.com/maps/place/${lat},${lon}` : "không lấy được vị trí"
        );
        existing.historyRef.push(referrer);

        await existing.save();

        const lastTimestamp = existing.historyTimestamps[existing.historyTimestamps.length - 2];

        const timeSinceLastVisit = lastTimestamp ? Date.now() - new Date(lastTimestamp).getTime() : Infinity;

        if (timeSinceLastVisit > 10_000 && (await shouldSendDiscord())) {
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

        return res.status(200).json({
          message: "Visitor updated",
        });
      }

      /* ================= NEW VISITOR ================= */

      const newTraffic = new Traffic({
        visitorId,
        Ip: ip,
        isBot: isBotUser,
        ref: referrer,
        browser,
        isAds: referrer?.includes("ads") ?? false,
        device,
        location: lat && lon ? `https://www.google.com/maps/place/${lat},${lon}` : "không lấy được vị trí",
        times: 1,
        historyIp: [ip],
        historyRef: [referrer],
        historyLocation: [lat && lon ? `https://www.google.com/maps/place/${lat},${lon}` : "không lấy được vị trí"],
        historyTimestamps: [new Date()],
      });

      await newTraffic.save();

      if (await shouldSendDiscord()) {
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

      return res.status(200).json({ message: "New visitor tracked" });
    } catch (err) {
      console.error("❌ Error tracking traffic:", err);
      return res.status(500).json({ error: "Internal server error" });
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
