import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/", // 👈 This line is important for Vercel SPA routing
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
