import express from "express";
const router = express.Router();
import settingController from "../app/controllers/setting.controller.js";
import Auth from "../middleware/checkToken.js";

router.get("/setting/read/all", settingController.readSetting);
router.post(
  "/setting/create",
  Auth.verifyAdmin,
  settingController.createSetting
);
router.put(
  "/setting/update/by-id",
  Auth.verifyAdmin,
  settingController.updateSetting
);
router.delete(
  "/setting/delete/by-id",
  Auth.verifyAdmin,
  settingController.deleteSetting
);
export default router;
