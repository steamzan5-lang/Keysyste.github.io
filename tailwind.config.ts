import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

// helper __dirname buat ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config Vercel aman
export default defineConfig(({ mode }) => {
  const plugins = [react(), runtimeErrorOverlay()];

  // hanya di dev mode Replit, tambahkan cartographer
  if (mode !== "production" && process.env.REPL_ID) {
    const addCartographer = async () => {
      const m = await import("@replit/vite-plugin-cartographer");
      return m.cartographer();
    };
    plugins.push(addCartographer());
  }

  return {
    base: "/", // penting buat SPA Vercel
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client/src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist"), // output untuk Vercel
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});    
