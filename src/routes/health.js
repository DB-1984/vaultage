import express from "express";
import { statusTemplate } from "../utils/statusTemplate.js";

const router = express.Router();

router.get("/", (req, res) => res.send(statusTemplate));

export default router;
