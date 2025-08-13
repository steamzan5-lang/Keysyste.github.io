import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertKeySchema, verifyKeyResponseSchema } from "@shared/schema";
import { z } from "zod";

function generateRandomKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for key verification
  app.get("/api/verify", async (req, res) => {
    try {
      const { key } = req.query;
      
      if (!key || typeof key !== 'string') {
        return res.status(400).json({ 
          status: "invalid",
          message: "Key parameter is required" 
        });
      }

      const keyRecord = await storage.getKeyByValue(key);
      
      if (!keyRecord) {
        return res.json({ status: "invalid" });
      }

      const now = Date.now();
      if (keyRecord.expiresAt < now) {
        return res.json({ status: "expired" });
      }

      return res.json({ status: "valid" });
    } catch (error) {
      console.error("Error verifying key:", error);
      return res.status(500).json({ 
        status: "invalid",
        message: "Internal server error" 
      });
    }
  });

  // Endpoint to generate a new key (called after step 3)
  app.post("/api/generate-key", async (req, res) => {
    try {
      const keyValue = generateRandomKey();
      const now = Date.now();
      const expiresAt = now + (24 * 60 * 60 * 1000); // 24 hours from now

      const newKey = await storage.createKey({
        key: keyValue,
        expiresAt,
        createdAt: now,
      });

      return res.json({
        key: newKey.key,
        expiresAt: newKey.expiresAt,
        createdAt: newKey.createdAt,
      });
    } catch (error) {
      console.error("Error generating key:", error);
      return res.status(500).json({ 
        message: "Failed to generate key" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
