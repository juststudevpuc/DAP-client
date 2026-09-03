import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // <-- 1. Import the new v4 plugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- 2. Add it to the plugins array
  ], 
  resolve: { 
    alias: { 
      "@": path.resolve(__dirname, "./src") 
    } 
  },
})