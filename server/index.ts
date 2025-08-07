import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { sendTestEmail, getEmailHistory } from "./routes/email";
import chatRouter from "./routes/chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Email API routes
  app.post("/api/email/test", sendTestEmail);
  app.get("/api/email/history", getEmailHistory);

  return app;
}
