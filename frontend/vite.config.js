import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Auto-load .env file based on current mode
  const env = loadEnv(mode, process.cwd(), "");
  console.log(`✅ Loaded frontend environment: .env.${mode}`);

  return {
    plugins: [react(), visualizer({ open: true })],
    test: {
      globals: true,
      environment: "jsdom", // needed for DOM testing
      setupFiles: "./src/setupTests.js",
    },

    build: {
      sourcemap: false,
      minify: "esbuild",
      cssCodeSplit: true, // Split CSS into smaller chunks
      rollupOptions: {
        output: {
          /*
          manualChunks(id) {
            if (id.includes("node_modules/react")) return "react-vendor";
            if (id.includes("node_modules/@mui")) return "mui-vendor";
            if (id.includes("node_modules")) return "vendor";
          },
          */
        },
      },
    },
  };
});
