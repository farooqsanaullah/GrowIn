import * as z from "zod";
import type { SocialLinks, EquityRange, StartupStatus } from "@/lib/types/api";

export const startupFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must not exceed 100 characters")
    .trim(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(2000, "Description must not exceed 2000 characters")
    .trim(),

  categoryType: z.string().min(1, "Category type is required"),

  industry: z.string().min(1, "Industry is required"),

  status: z.enum(["active", "inactive", "closed"]).default("active"),

  profilePic: z.string().url("Invalid URL format").optional().or(z.literal("")),

  socialLinks: z
    .object({
      website: z
        .string()
        .url("Invalid website URL")
        .optional()
        .or(z.literal("")),
      linkedin: z
        .string()
        .url("Invalid LinkedIn URL")
        .optional()
        .or(z.literal("")),
      twitter: z
        .string()
        .url("Invalid Twitter URL")
        .optional()
        .or(z.literal("")),
      x: z.string().url("Invalid X URL").optional().or(z.literal("")),
      instagram: z
        .string()
        .url("Invalid Instagram URL")
        .optional()
        .or(z.literal("")),
      facebook: z
        .string()
        .url("Invalid Facebook URL")
        .optional()
        .or(z.literal("")),
    })
    .optional(),

  equityRange: z
    .array(
      z.object({
        range: z.string().min(1, "Range is required"),
        equity: z
          .number()
          .min(0, "Equity cannot be negative")
          .max(100, "Equity cannot exceed 100"),
      })
    )
    .default([]),
});

export type StartupFormData = z.infer<typeof startupFormSchema>;


export const INDUSTRY_OPTIONS = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Retail",
  "Food & Beverage",
  "Sustainability",
  "Manufacturing",
  "Mobility",
  "Real Estate",
  "Media"
];


// Category type options
export const CATEGORY_TYPE_OPTIONS = ["B2B", "B2C", "C2B", "C2C"];


// Status options
export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "closed", label: "Closed" },
];
