import mongoose, { Schema, Document } from 'mongoose';

import "./user.model";
import "./startup.model";

import "./user.model";
import "./startup.model";

export interface IInvestment extends Document {
  investorId: mongoose.Types.ObjectId;
  startupId: mongoose.Types.ObjectId;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'expired';
  stripeInvoiceId?: string;
  stripeCustomerId?: string;
  paidAt?: Date;
  failedAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>({
  investorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  startupId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Startup' },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded', 'expired'], default: 'pending' },  
  stripeInvoiceId: { type: String, unique: true, sparse: true },
  stripeCustomerId: { type: String },
  paidAt: { type: Date },
  failedAt: { type: Date },
  cancelledAt: { type: Date },
  refundedAt: { type: Date },
}, { timestamps: true });


// InvestmentSchema.index({ investorId: 1, startupId: 1 }, { unique: true });
// --> investor can make more than 1 payment


InvestmentSchema.index({ investorId: 1, createdAt: -1 });


InvestmentSchema.index({ startupId: 1, createdAt: -1 });


InvestmentSchema.index({ investorId: 1, amount: -1 });


InvestmentSchema.index({ startupId: 1, amount: -1 });


InvestmentSchema.index({ amount: -1, createdAt: -1 });


const Investment = mongoose.models.Investment || mongoose.model<IInvestment>("Investment", InvestmentSchema);

export default Investment;
