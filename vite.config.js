import { defineConfig } from "vite";

export default defineConfig({
  base: "/threejs-tour/",
  optimizeDeps: {
    include: ["@tweenjs/tween.js"],
  },
});
