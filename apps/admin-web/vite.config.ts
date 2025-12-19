import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), jsx()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4080/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/socket.io": {
        target: "ws://localhost: 8080",
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
});
