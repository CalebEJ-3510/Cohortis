import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Generate routeTree.gen.ts automatically from src/routes/
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  // Native tsconfig paths support (Vite 5.3+), no plugin needed
  resolve: {
    tsconfigPaths: true,
  },
  // Relative base so assets work from any GitHub Pages subpath
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // In Vite 8 (rolldown), manualChunks must be a function
        manualChunks(id: string) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@tanstack/react-router")) {
            return "vendor-router";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "vendor-query";
          }
        },
      },
    },
  },
});
