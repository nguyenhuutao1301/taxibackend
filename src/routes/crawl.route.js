import express from "express";
import { crawlFromSitemapController, convertCrawledContentController } from "../app/controllers/crawl.controller.js";

const router = express.Router();

// POST /api/crawl
router.patch("/crawl/clean", convertCrawledContentController);
router.post("/crawl", crawlFromSitemapController);

export default router;
