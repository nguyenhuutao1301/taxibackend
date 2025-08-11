import express from "express";
const router = express.Router();
import OpenAiController from "../app/controller/openAi.controller.js";

router.post("/openAi/create/prompt/post", OpenAiController.generatePost);
export default router;
