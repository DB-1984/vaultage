import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import folderRoutes from "./routes/folders.js";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/folders", folderRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on ${port}`));
