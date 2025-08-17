import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    slug: { type: String },
    numberphone: { type: String },
  },
  { timestamps: true }
);
export function getSettingModel(connection) {
  return connection.model("Setting", settingSchema);
}
