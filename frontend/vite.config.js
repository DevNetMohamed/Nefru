import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";


// Vite configuration
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },

    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },

  resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},

});