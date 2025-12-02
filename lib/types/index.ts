import { Types } from 'mongoose';

export type UserRole = 'investor' | 'founder' | 'team_member';

export type MessageType = 'text' | 'system';

export interface IUser {
  _id: Types.ObjectId | string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}


export interface IParticipant {
  userId: string; // Mongo ObjectId as string
  role: string;
}

export interface IConversation {
  _id: string;
  participants: IParticipant[];
  createdBy: string;
  startupId: string;
  isTeamChat: boolean;
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface IMessage {
  _id: Types.ObjectId | string;
  conversationId: Types.ObjectId | string;
  senderId: Types.ObjectId | IUser;
  senderRole: UserRole;
  content: string;
  type: MessageType;
  readBy: Array<{
    userId: Types.ObjectId | string;
    readAt: Date;
  }>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface SessionUser {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  avatar?: string;
}

export interface PusherMessage {
  message: IMessage;
}

export interface CreateConversationRequest {
  recipientId: string;
  recipientRole: UserRole;
  startupId: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
}

export interface GetMessagesQuery {
  conversationId: string;
  limit?: number;
  before?: string;
}