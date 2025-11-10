import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../backend/frontend/dist"
  },
  server: {
    port: 5173
  }
});
