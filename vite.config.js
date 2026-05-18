import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: "static/js/[name].js",
        chunkFileNames: "static/js/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            return "static/css/[name].[ext]";
          }
          return "static/media/[name].[ext]";
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost",
      },
    },
    setupFiles: "./src/test-setup.js",
    css: true,
    server: {
      deps: {
        inline: ["vitest"],
      },
    },
  },
});
