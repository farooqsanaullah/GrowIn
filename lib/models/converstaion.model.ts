import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["FOUNDER","INVESTOR","TEAM"], required: true }
}, { _id: false });

const ConversationSchema = new mongoose.Schema({
  type: { type: String, enum: ["INVESTOR_FOUNDER","TEAM_CHAT"], required: true },
  participants: { type: [ParticipantSchema], required: true },

  startupId: { type: mongoose.Schema.Types.ObjectId, ref: "Startup" }, 
  initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, 
  firstMessageSent: { type: Boolean, default: false },

  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ConversationSchema.index({ startupId: 1, "participants.user": 1 });
ConversationSchema.pre("save", function(next) {
  this.updatedAt = new Date(Date.now());
  next();
});

export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
