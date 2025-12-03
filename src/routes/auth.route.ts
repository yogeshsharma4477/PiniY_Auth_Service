// src/routes/auth.route.ts
import { Router } from "express";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema,forgotPasswordSchema, verifyOtpSchema, resetPasswordSchema } from "../validation/auth.schema";
import { LoginController, RegisterController } from "../controller/auth.controller";
import { forgotPasswordController, resetPasswordController, verifyOtpController } from "../controller/resetPassword.controller";


const router = Router();
router.post("/register", validate(registerSchema), RegisterController);

router.post("/login", validate(loginSchema), LoginController );

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswordController);

router.post("/verify-otp", validate(verifyOtpSchema), verifyOtpController);

router.post("/reset-password", validate(resetPasswordSchema), resetPasswordController);

export default router;
