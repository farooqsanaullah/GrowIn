import mongoose, { Schema, Document } from "mongoose";

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

// Prevent duplicate investments by same investor on same startup
InvestmentSchema.index({ investorId: 1, startupId: 1 }, { unique: true });

// ✅ Fix for "OverwriteModelError"
const Investment = mongoose.models.Investment || mongoose.model<IInvestment>("Investment", InvestmentSchema);

export default Investment;
