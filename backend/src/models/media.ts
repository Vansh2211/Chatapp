import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  mediaData: { type: String, required: true }, // Base64 data
  mediaType: { type: String, required: true }, // File type (image/png, application/pdf, etc.)
  timestamp: { type: String, required: true },
});

const Media = mongoose.model("Media", MediaSchema);
export default Media;
