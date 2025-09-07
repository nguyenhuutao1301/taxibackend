import express from "express";
const router = express.Router();
import SettingCtl from "../app/controllers/setting.controller.js";
import Auth from "../middleware/checkToken.js";

router.get("/setting/read/all", Auth.verifyAdmin, SettingCtl.readSetting);
router.post("/setting/create", Auth.verifyAdmin, SettingCtl.createSetting);
router.put("/setting/update/by-id", Auth.verifyAdmin, SettingCtl.updateSetting);
router.delete(
  "/setting/delete/by-id",
  Auth.verifyAdmin,
  SettingCtl.deleteSetting
);
export default router;
