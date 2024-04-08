import { defineConfig } from "vite";
import "dotenv/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env
  },
  server: {
    https: {
      key: 'key.key',
      cert: 'cert.cert'
    }
  },
});
