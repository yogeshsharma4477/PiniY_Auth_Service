import bcrypt from "bcrypt";
import { prisma } from "../prisma/client.js";
import crypto from "crypto";
import { Request, Response, NextFunction } from 'express';

export const forgotPasswordController =  async  (req: Request, res: Response, next: NextFunction) => {
  const { email, phone } = (req as any).validated.body;

  try {
    const where = email ? { email } : { phone };
    const user = await prisma.user.findUnique({ where });

    // Always respond success even if user not found (security)
    if (!user) return res.json({ status: "ok" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        otp,
        expiresAt,
      },
    });

    // DEMO MODE → log OTP instead of sending SMS/email
    console.log(`OTP for user ${user.id}:`, otp);

    return res.json({ status: "ok" });
  } catch (err) {
     next(err);
  }
}

export const verifyOtpController = async  (req: Request, res: Response, next: NextFunction) => {
  const { email, phone, otp } = (req as any).validated.body;
  const where = email ? { email } : { phone };
  try {
    const user = await prisma.user.findUnique({ where });
    
    if (!user) return res.status(400).json({ error: "invalid_otp" });

    const record = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) return res.status(400).json({ error: "invalid_otp" });

    const resetToken = crypto.randomUUID();

    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { used: true },
    });

    // Save reset token
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: resetToken, // reusing session table
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    return res.json({ resetToken });
  } catch (err) {
     next(err);
  }
}

export const resetPasswordController =  async  (req: Request, res: Response, next: NextFunction) => {
  const { resetToken, newPassword } = (req as any).validated.body;

  try {
    const session = await prisma.session.findFirst({
      where: { refreshToken: resetToken },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(400).json({ error: "invalid_or_expired_token" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);  

    await prisma.user.update({
      where: { id: session.userId },
      data: { passwordHash },
    });

    // Delete reset token + logout all devices
    await prisma.session.deleteMany({
      where: { userId: session.userId },
    });

    return res.json({ status: "password_updated" });
  } catch (err) {
     next(err);
  }
}