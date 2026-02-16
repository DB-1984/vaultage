import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/test", protect, (req, res) => {
  res.json({ message: "Protect middleware working" });
});
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", logout);

router.get("/", (req, res) => {
  res.json({ message: "Auth route working" });
});

export default router;
