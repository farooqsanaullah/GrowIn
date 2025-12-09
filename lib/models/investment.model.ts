import mongoose, { Schema, Document } from "mongoose";

import "./user.model";
import "./startup.model";

export interface IInvestment extends Document {
  investorId: mongoose.Types.ObjectId;
  startupId: mongoose.Types.ObjectId;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>({
  investorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  startupId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Startup" },
  amount: { type: Number, required: true },
}, { timestamps: true });


InvestmentSchema.index({ investorId: 1, startupId: 1 }, { unique: true });


InvestmentSchema.index({ investorId: 1, createdAt: -1 });


InvestmentSchema.index({ startupId: 1, createdAt: -1 });


InvestmentSchema.index({ investorId: 1, amount: -1 });


InvestmentSchema.index({ startupId: 1, amount: -1 });


InvestmentSchema.index({ amount: -1, createdAt: -1 });


const Investment = mongoose.models.Investment || mongoose.model<IInvestment>("Investment", InvestmentSchema);

export default Investment;
