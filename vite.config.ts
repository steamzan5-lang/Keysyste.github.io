import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Definisi __dirname versi ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode !== "production" && process.env.REPL_ID
      ? [
          // Dynamic import untuk Replit Dev Mode
          (async () =>
            await import("@replit/vite-plugin-runtime-error-modal").then(
              (m) => m.default()
            ))(),
          (async () =>
            await import("@replit/vite-plugin-cartographer").then(
              (m) => m.cartographer()
            ))(),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  base: "/", // Penting untuk Vercel SPA
  build: {
    outDir: path.resolve(__dirname, "dist"), // folder build untuk Vercel
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
}));
