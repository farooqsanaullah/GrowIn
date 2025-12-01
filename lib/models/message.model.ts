import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  attachments: [{ url: String, filename: String }], // optional
  createdAt: { type: Date, default: Date.now, index: true },
  editedAt: { type: Date, default: null },
  deleted: { type: Boolean, default: false }
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
