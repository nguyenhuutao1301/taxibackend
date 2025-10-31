import express from "express";
import { crawlFromSitemapController } from "../app/controllers/crawl.controller.js";

const router = express.Router();

// POST /api/crawl
router.post("/crawl", crawlFromSitemapController);

export default router;
