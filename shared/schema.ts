import { z } from "zod";

export const keySchema = z.object({
  id: z.string(),
  key: z.string(),
  expiresAt: z.number(), // Unix timestamp in milliseconds
  createdAt: z.number(), // Unix timestamp in milliseconds
});

export const insertKeySchema = keySchema.omit({
  id: true,
});

export type Key = z.infer<typeof keySchema>;
export type InsertKey = z.infer<typeof insertKeySchema>;

export const verifyKeyResponseSchema = z.object({
  status: z.enum(["valid", "expired", "invalid"]),
});

export type VerifyKeyResponse = z.infer<typeof verifyKeyResponseSchema>;
