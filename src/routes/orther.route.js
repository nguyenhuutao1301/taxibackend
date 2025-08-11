import express from "express";
const router = express.Router();
import OrtherController from "../app/controller/orther.controller.js";

router.post(
  "/sentmessage/discord/traffic",
  OrtherController.sentMessageTrafficDiscord
);
export default router;
