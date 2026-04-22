import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: true
  },
  senderRole: {                           
    type: String,
    enum: ['investor', 'founder', 'team_member'],
    required: true
  },
  type: {                                 
    type: String,
    enum: ['text', 'system'],
    default: 'text'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Index for faster queries
MessageSchema.index({ conversationId: 1, createdAt: -1 });

export default mongoose.models.Message ||
  mongoose.model('Message', MessageSchema);
