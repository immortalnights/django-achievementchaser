/// <reference types="vitest" />

import { defineConfig } from "vite"
import { resolve } from "path"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
            "@test": resolve(__dirname, "test"),
        },
    },
    server: {
        proxy: {
            "/graphql": {
                target: "http://127.0.0.1:8000",
                // changeOrigin: true,
            },
        },
    },
})
