import express from "express";
const router = express.Router();
import checkToken from "../middleware/checkToken.js";
import OrtherControler from "../app/controller/order.controller.js";
router.post("/booking/discord/create", OrtherControler.createBooking);
router.post("/booking/get-all/history", OrtherControler.getHistoryBooking);
router.get(
  "/booking/get-all",
  checkToken.verifyAdmin,
  OrtherControler.getAllBooking
);
router.delete(
  "/booking/delete",
  checkToken.verifyAdmin,
  OrtherControler.deleteBookingById
);
router.put(
  "/booking/update",
  checkToken.verifyAdmin,
  OrtherControler.updateBooking
);
export default router;
