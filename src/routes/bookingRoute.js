import express from "express";
const router = express.Router();
import checkToken from "../middleware/checkToken.js";
import BookingController from "../app/controller/BookingController.js";
router.post("/booking/discord/create", BookingController.createBooking);
router.post("/booking/get-all/history", BookingController.getHistoryBooking);
router.get(
  "/booking/get-all",
  checkToken.verifyAdmin,
  BookingController.getAllBooking
);
router.delete(
  "/booking/delete",
  checkToken.verifyAdmin,
  BookingController.deleteBookingById
);
router.put(
  "/booking/update",
  checkToken.verifyAdmin,
  BookingController.updateBooking
);
export default router;
