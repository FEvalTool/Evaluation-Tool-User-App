import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

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
    plugins: [react()],
});
