import { z } from "zod";

export const investmentSchema = z.object({
  investorId: z.string().min(1, "Investor ID is required"),
  startupId: z.string().min(1, "Startup ID is required"),
  amount: z.union([
    z.number().positive("Amount must be greater than 0"),
    z.string().min(1).transform((val) => Number(val)),
  ]).refine((val) => !isNaN(val) && val > 0, {
    message: "Invalid investment amount",
  }),
});

export type InvestmentBody = z.infer<typeof investmentSchema>;
