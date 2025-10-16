import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Auto-load .env file based on current mode
  const env = loadEnv(mode, process.cwd(), "");
  console.log(`✅ Loaded frontend environment: .env.${mode}`);

  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: "jsdom", // needed for DOM testing
      setupFiles: "./src/setupTests.js",
    },
  };
});
