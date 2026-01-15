import express from "express";
import cors from "cors";
import itemsRouter from "./routes/items.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/items", itemsRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";
  const payload = {
    message: err.message || "Server error"
  };

  if (!isProd) {
    payload.name = err.name;
    payload.stack = err.stack;
    payload.details = err.errors || err.details;
  }

  res.status(status).json(payload);
});

export default app;
