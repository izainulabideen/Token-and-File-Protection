import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/v1": {
        target: "https://user-and-file-auth.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
});
