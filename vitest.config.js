import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: "tests/setup.js",
        provider: "v8",
        globals: true,
        coverage: {
            reporter: ["text", "lcov"],
        },
        testTimeout: 100000,
    },
    plugins: [react(), svgr()],
});
