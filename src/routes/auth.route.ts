// src/routes/auth.route.ts
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";
import { ENV } from "../config/env";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, RegisterInput, LoginInput } from "../validation/auth.schema";

const router = Router();
router.post("/register", validate(registerSchema), async (req, res, next) => {
  const data = (req as any).validated.body as RegisterInput;

  try {
    // check unique
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email ?? undefined }, { phone: data.phone ?? undefined }],
      },
    });
    if (existing) return res.status(409).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName
      },
    });

    // do not return passwordHash
    const { passwordHash: _p, ...safeUser } = user as any;
    res.status(201).json({ user: safeUser });
  } catch (err) {
    next(err); // pass to central handler
  }
});

// Login (inline example)
router.post("/login", validate(loginSchema), async (req, res, next) => {
  const data = (req as any).validated.body as LoginInput
  try {
    console.log(data,"data");
    
    const where = data.email ? { email: data.email } : { phone: data.phone! };
    const user = await prisma.user.findUnique({ where });
    if (!user || !user.passwordHash) return res.status(401).json({ error: "invalid_credentials" });

    const valid = await bcrypt.compare(data.password, user.passwordHash); 
    if (!valid) return res.status(401).json({ error: "invalid_credentials" });

    const token = jwt.sign({ userId: user.id, userType: user.userType }, ENV.JWT_SECRET!, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId: user.id }, ENV.JWT_REFRESH_SECRET!, { expiresIn: "30d" });

    // persist refresh token in sessions table ideally (you have sessions model)
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return res.json({ token, refreshToken });
  } catch (err) {
     next(err); // pass to central handler
  }
});


export default router;
