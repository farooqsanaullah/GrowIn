import { Types } from 'mongoose';

export type UserRole = string;

export type MessageType = 'text' | 'system';

// User interface
export interface IUser {
  _id: Types.ObjectId | string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profileImage?: string;
  userName?: string;
}

// Participant interface - can be populated or just an ID
export interface IParticipant {
  userId: IUser | Types.ObjectId | string;
  role: UserRole;
  _id?: Types.ObjectId | string;
  userName: string;
  avatar?: string;
  image?: string;
}

// Last message interface
export interface ILastMessage {
  content: string;
  sentAt: Date | string;
  senderId: Types.ObjectId | string;
}

// Conversation interface
export interface IConversation {
  _id: Types.ObjectId | string;
  participants: IParticipant[];
  createdBy: Types.ObjectId | string;
  startupId: Types.ObjectId | string;
  isTeamChat: boolean;
  lastMessage: ILastMessage; // Changed from string to ILastMessage
  lastMessageAt: Date | string;
  createdAt: Date | string;
}

// Message interface
export interface IMessage {
  _id: Types.ObjectId | string;
  conversationId: Types.ObjectId | string;
  senderId: Types.ObjectId | IUser | string;
  senderRole: UserRole;
  senderName?: string;
  text: string; // Match the model field name
  content?: string; // Optional for backward compatibility
  type: MessageType;
  readBy?: Array<Types.ObjectId | string>;
  createdAt: Date | string;
}

// API Response
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Session User
export interface SessionUser {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  avatar?: string;
}

// Pusher Message
export interface PusherMessage {
  message: IMessage;
}

// Create Conversation Request
export interface CreateConversationRequest {
  recipientId: string;
  recipientRole: UserRole;
  startupId: string;
}

// Send Message Request
export interface SendMessageRequest {
  conversationId: string;
  content: string;
}

// Get Messages Query
export interface GetMessagesQuery {
  conversationId: string;
  limit?: number;
  before?: string;
}