import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            framer: path.resolve(__dirname, "framer-shim.ts"),
            "framer-motion": path.resolve(
                __dirname,
                "node_modules/framer-motion"
            ),
            react: path.resolve(__dirname, "node_modules/react"),
            "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
        },
        dedupe: ["react", "react-dom", "framer-motion"],
    },
    server: {
        host: "127.0.0.1",
        port: 4176,
        fs: {
            allow: [".."],
        },
    },
})
