import mongoose, { Schema, Document } from "mongoose";

export interface IInvestment extends Document {
  investorId: mongoose.Types.ObjectId;
  startupId: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "paid" | "failed";
  stripeInvoiceId?: string;
  stripeCustomerId?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>({
  investorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  startupId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Startup" },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  stripeInvoiceId: { type: String },
  stripeCustomerId: { type: String },
  paidAt: { type: Date },
}, { timestamps: true });

// ✅ Fix for "OverwriteModelError"
const Investment = mongoose.models.Investment || mongoose.model<IInvestment>("Investment", InvestmentSchema);

export default Investment;
