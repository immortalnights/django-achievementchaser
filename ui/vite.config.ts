/// <reference types="vitest" />

import { defineConfig } from "vite"
import { resolve } from "path"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
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
