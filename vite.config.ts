import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode !== "production" && process.env.REPL_ID
      ? [
          // Pakai dynamic import kalau di Replit Dev Mode
          (async () =>
            await import("@replit/vite-plugin-runtime-error-modal").then((m) =>
              m.default()
            ))(),
          (async () =>
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer()
            ))(),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  base: "/", // ini penting untuk Vercel
  build: {
    outDir: path.resolve(__dirname, "dist"), // ubah jadi dist
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
}));
