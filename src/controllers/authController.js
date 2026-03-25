import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

// Runtime
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error("Invalid email or password.");
  }

  const { email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409);
    throw new Error("Email already registered.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  });

  res.status(201).json(user);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 2. Check if user exists AND password matches
  // Note: We use bcrypt.compare because Prisma models don't have custom methods
  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    // 3. Generate token (JWT)
    generateToken(res, user.id);

    // 4. Return user data (excluding the password hash)
    return res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      message: "Logged in",
    });
  } else {
    // If we fail, the asyncHandler will catch the thrown error
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.status(200).json({ message: "Logged out" });
};
