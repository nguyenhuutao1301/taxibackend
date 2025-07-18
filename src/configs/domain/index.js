//src/configs/domain/index.js
import dotenv from "dotenv";
dotenv.config();
const configMap = {
  "localhost:3000": {
    DATABASE_URI: process.env.MONGODB_URI_LOCAL,
    DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK_URL_LOCAL,
    JWT_SECRET: process.env.JWT_SECRET_LOCAL,
    JWT_SECRET_RERESH: process.env.JWT_SECRET_RERESH_LOCAL,
    HOST: process.env.HOST,
    EMAIL_USER: process.env.EMAIL_USER_LOCAL,
    EMAIL_PASS: process.env.EMAIL_PASS_LOCAL,
    FRONTEND_NAME: "local",
    DOMAIN: process.env.DOMAIN,
  },
  "taxifrontend.vercel.app": {
    DATABASE_URI: process.env.MONGODB_URI_DUYHAI,
    DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK_URL_DUYHAI,
    JWT_SECRET: process.env.JWT_SECRET_DUYHAI,
    JWT_SECRET_RERESH: process.env.JWT_SECRET_RERESH_DUYHAI,
    HOST: process.env.HOST,
    EMAIL_USER: process.env.EMAIL_USER_DUYHAI,
    EMAIL_PASS: process.env.EMAIL_PASS_DUYHAI,
    FRONTEND_NAME: "duyhaiweb",
    DOMAIN: process.env.DOMAIN_DUYHAI,
  },
  "taxinhanh247.pro.vn": {
    DATABASE_URI: process.env.MONGODB_URI_TAXINHANH,
    DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK_URL_TAXINHANH,
    JWT_SECRET: process.env.JWT_SECRET_TAXINHANH,
    JWT_SECRET_RERESH: process.env.JWT_SECRET_RERESH_TAXINHANH,
    HOST: process.env.HOST,
    EMAIL_USER: process.env.EMAIL_USER_TAXINHANH,
    EMAIL_PASS: process.env.EMAIL_PASS_TAXINHANH,
    FRONTEND_NAME: "taxinhanh247",
    DOMAIN: process.env.DOMAIN_TAXINHANH,
  },
};
export default configMap;
