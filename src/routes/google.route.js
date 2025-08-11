import express from "express";
import GoogleController from "../app/controller/google.controller.js";

const router = express.Router();

// POST /api/index-url
router.post("/index-url", GoogleController.postIndexUrl);
export default router;
