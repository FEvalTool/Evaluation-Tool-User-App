import { defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: "tests/setup.js"
    },
    plugins: [react()],
})