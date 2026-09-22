import { defineConfig } from "vite";

export default defineConfig({

    // GitHub Pages 项目地址：
    // https://QIN329.github.io/QIN-Lab/
    base: "/QIN-Lab/",

    server: {
        host: "localhost",
        port: 5173,
        open: true
    },

    build: {
        sourcemap: true
    }

});