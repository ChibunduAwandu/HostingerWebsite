import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        // Keep the renderer separate without pulling React's reconciler into the HTML entry.
        manualChunks(id) {
          if (id.includes("/node_modules/three/")) return "three-core";
        },
      },
    },
  },
  server: { host: "0.0.0.0", port: 5173 },
});
