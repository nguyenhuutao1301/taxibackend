import { getSettingModel } from "../models/setting.models.js";
class settingController {
  createSetting = async (req, res) => {
    if (!req.db) {
      return res
        .status(500)
        .json({ message: "Không kết nối được database", success: false });
    }
    const Setting = getSettingModel(req.db);
    try {
      const { slug, numberphone } = req.body;
      if (!slug || !numberphone) {
        return res.status(400).json({
          message: "thiếu đường dẫn hoặc số điện thoại",
          success: false,
        });
      }
      const hasSlug = await Setting.findOne({ slug });
      if (hasSlug) {
        return res
          .status(400)
          .json({ message: "slug đã tồn tại", success: false });
      }
      const newSetting = new Setting({ slug, numberphone });
      await newSetting.save();
      return res
        .status(200)
        .json({ message: "đã tạo thành công", success: true });
    } catch (error) {
      console.log("500 error", error);
      return res.status(500).json({
        message: "Lỗi server 500",
        error: error.message,
        success: false,
      });
    }
  };
  readSetting = async (req, res) => {
    if (!req.db) {
      return res
        .status(500)
        .json({ message: "Không kết nối được database", success: false });
    }
    const Setting = getSettingModel(req.db);
    try {
      const result = await Setting.find({}).sort({ createdAt: -1 }).exec();
      return res.status(200).json({
        result,
        success: true,
        message: "đã tải dữ liệu cài đặt thành công",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi server 500",
        error: error.message,
        success: false,
      });
    }
  };
  updateSetting = async (req, res) => {
    if (!req.db) {
      return res
        .status(500)
        .json({ message: "Không kết nối được database", success: false });
    }
    const Setting = getSettingModel(req.db);
    const _id = req.query.id;

    if (!_id) {
      return res.status(400).json({ success: false, message: "Thiếu id" });
    }

    try {
      const existing = await Setting.findById(_id);
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy setting" });
      }

      const data = req.body;

      const updatedAt = new Date();
      const settingUpdate = { ...data, updatedAt };
      Object.keys(settingUpdate).forEach(
        (key) => settingUpdate[key] === undefined && delete settingUpdate[key]
      );

      const Updated = await Setting.findByIdAndUpdate(_id, settingUpdate, {
        new: true,
      });
      if (!Updated) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Lấy slug từ bài viết vừa update
      const slug = Updated.slug;
      try {
        await fetch(
          `${config.DOMAIN}/api/revalidate?slug=${slug}&secret=${process.env.REVALIDATE_SECRET}`
        );
        console.log("Revalidate success for slug:", slug);
      } catch (err) {
        console.error("Revalidate error:", err);
      }
      return res.json({ message: "Update thành công", success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message, success: false });
    }
  };

  deleteSetting = async (req, res) => {
    if (!req.db) {
      return res
        .status(500)
        .json({ message: "Không kết nối được database", success: false });
    }
    const Setting = getSettingModel(req.db);
    const _id = req.query.id;

    if (!_id) {
      return res.status(400).json({ success: false, message: "Thiếu id" });
    }

    try {
      const deleted = await Setting.findByIdAndDelete(_id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy setting" });
      }
      return res.json({ success: true, message: "Xóa thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message, success: false });
    }
  };
}
export default new settingController();
