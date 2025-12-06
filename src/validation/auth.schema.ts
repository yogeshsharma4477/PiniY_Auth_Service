import { z } from "zod";

const trimmedString = () => z.string().trim();

// Register
export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .optional(),
  phone: trimmedString().min(10)
    .regex(/^\+[1-9]\d{1,14}$/, { message: "Phone must be in E.164 format, e.g. +919876543210" })
    .optional(),
  password: z.string().min(6).max(128),
  firstName: trimmedString().min(2).max(100).optional(),
  lastName: trimmedString().min(2).max(100).optional(),
});


// Login
export const loginSchema = z.object({
  // allow login by email or phone
  email: trimmedString().email().optional(),
  phone: trimmedString().min(10)
    .regex(/^\+[1-9]\d{1,14}$/, { message: "Phone must be in E.164 format" })
    .optional(),
  password: z.string().min(6),
}).refine((data) => Boolean(data.email || data.phone), {
  message: "Either email or phone must be provided",
});

// Refresh token
export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

// OTP send/verify
export const sendOtpSchema = z.object({
  phone: trimmedString().regex(/^\+[1-9]\d{1,14}$/, { message: "Phone must be in E.164 format" }),
});

export const verifyOtpSchema = z.object({
  phone: trimmedString().regex(/^\+[1-9]\d{1,14}$/).optional(),
  email:  z
    .string()
    .trim()
    .email("Invalid email format")
    .optional(),
  otp: z.string().length(6),
});

export const forgotPasswordSchema = z.object({
  email:  z
    .string()
    .trim()
    .email("Invalid email format")
    .optional(),
  phone: z.string().min(10).optional(),
}).refine((data) => data.email || data.phone, {
  message: "Either email or phone is required",
  path: ["email", "phone"],
});

export const resetPasswordSchema = z.object({
  resetToken: z.string(),
  newPassword: z.string().min(6),
});

// Types exported for controller convenience
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;