import express from "express";
import { protect } from "../middleware/protect.js";
import {
  createFileMetadata,
  getDownloadUrl,
  deleteFile,
  updateFile,
} from "../controllers/fileController.js";

const router = express.Router();
/* DISABLED FOR DEMO
router.post("/", protect, createFileMetadata);
router.delete("/:id", protect, deleteFile);
router.patch("/:id", protect, updateFile);
*/
router.get("/:id/download-url", protect, getDownloadUrl);

export default router;
