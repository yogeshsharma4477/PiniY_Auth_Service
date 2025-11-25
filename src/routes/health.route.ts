import { Router } from "express";
import { prisma } from "../prisma/client";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const userCount = await  prisma.user.count();
    res.status(200).json({ status: "ok", database: "connected", "userCountusers" : userCount });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected", error: error });
  }
});

export default router;
