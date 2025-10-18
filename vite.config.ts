import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: { 
    outDir: "dist", 
    assetsDir: "assets", 
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          radix: Object.keys(require("./package.json").dependencies).filter(k => k.startsWith("@radix-ui"))
        }
      }
    }
  },
  preview: { port: 4173, strictPort: true }
});
