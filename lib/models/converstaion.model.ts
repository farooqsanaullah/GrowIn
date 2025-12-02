import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
});

const LastMessageSchema = new mongoose.Schema({
  content: { type: String, default: '' },
  sentAt: { type: Date },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { _id: false }); // No separate _id for embedded lastMessage

const ConversationSchema = new mongoose.Schema({
  participants: {
    type: [ParticipantSchema],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true,
  },
  isTeamChat: {
    type: Boolean,
    default: false,
  },
  lastMessage: {
    type: LastMessageSchema,
    default: () => ({}),
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for faster queries
ConversationSchema.index({ 'participants.userId': 1 });
ConversationSchema.index({ startupId: 1 });

export default mongoose.models.Conversation ||
  mongoose.model('Conversation', ConversationSchema);
