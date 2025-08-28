import express from "express";
const router = express.Router();
import dashboardController from "../app/controllers/dashboard.controller.js";
import checkToken from "../middleware/checkToken.js";

router.get(
  "/dashboard/stats",
  checkToken.verifyAdmin,
  dashboardController.getStats
);

export default router;
