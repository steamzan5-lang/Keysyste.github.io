import { type Key, type InsertKey } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createKey(key: InsertKey): Promise<Key>;
  getKeyByValue(keyValue: string): Promise<Key | undefined>;
  deleteExpiredKeys(): Promise<void>;
}

export class MemStorage implements IStorage {
  private keys: Map<string, Key>;

  constructor() {
    this.keys = new Map();
    // Clean up expired keys every minute
    setInterval(() => {
      this.deleteExpiredKeys();
    }, 60000);
  }

  async createKey(insertKey: InsertKey): Promise<Key> {
    const id = randomUUID();
    const key: Key = { ...insertKey, id };
    this.keys.set(key.key, key);
    return key;
  }

  async getKeyByValue(keyValue: string): Promise<Key | undefined> {
    return this.keys.get(keyValue);
  }

  async deleteExpiredKeys(): Promise<void> {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.keys.forEach((key, keyValue) => {
      if (key.expiresAt < now) {
        keysToDelete.push(keyValue);
      }
    });
    
    keysToDelete.forEach(keyValue => {
      this.keys.delete(keyValue);
    });
  }
}

export const storage = new MemStorage();
