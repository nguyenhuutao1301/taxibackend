import axios from "axios";
async function sendDiscordMessage({
  ip,
  lat,
  lon,
  referrer,
  device,
  browser,
  userAgent,
  DISCORD_WEBHOOK_URL,
}) {
  const maps =
    lat && lon
      ? `[Google Maps](https://www.google.com/maps/place/${lat},${lon})`
      : "không được phép lấy vị trí";
  return axios.post(DISCORD_WEBHOOK_URL, {
    embeds: [
      {
        title: `👤 Truy cập từ ${referrer || "Trực tiếp"}`,
        color: 3447003,
        fields: [
          { name: "🌐 IP :", value: ip, inline: true },
          {
            name: "📍 Vị trí",
            value: maps,
            inline: true,
          },
          { name: "💻 Thiết bị", value: device, inline: true },
          { name: "🌍 Trình duyệt", value: browser, inline: true },
          { name: "🔍 User-Agent", value: userAgent || "unknown" },
        ],
        timestamp: new Date(),
      },
    ],
  });
}
const sendOrderToDiscord = async ({
  addressFrom,
  addressTo,
  phoneNumber,
  serviceType,
  additionalInfo,
  DISCORD_WEBHOOK_URL,
}) => {
  return axios.post(DISCORD_WEBHOOK_URL, {
    embeds: [
      {
        title: `👤 Đơn Hàng Mới`,
        color: 3447003,
        fields: [
          { name: "📍 Đón", value: addressFrom, inline: true },
          { name: "📍 Đến", value: addressTo, inline: true },
          { name: "📞 Phone", value: phoneNumber, inline: true },
          { name: "🚗 Dịch vụ", value: serviceType, inline: true },
          {
            name: "📄 Thêm",
            value: additionalInfo || "Không có",
            inline: false,
          },
        ],
        timestamp: new Date(),
      },
    ],
  });
};
export { sendDiscordMessage, sendOrderToDiscord };
