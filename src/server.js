import express from "express";
import cors from "cors";
import "dotenv/config";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import storageRoutes from "./routes/storageRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import health from "./routes/health.js";
import { errorHandler } from "./utils/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/", health);
app.use("/auth", authRoutes);
app.use("/folders", folderRoutes);
app.use("/files", fileRoutes);
app.use("/storage", storageRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on ${port}`));
