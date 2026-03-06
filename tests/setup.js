import { vi } from "vitest";
// Define here so that we don't need to define this in every test
import "@testing-library/jest-dom/vitest";
import { server, resetTrackers } from "./mocks/mockServer";
import { Blob } from "blob-polyfill";

// Polyfill Blob for test environment
globalThis.Blob = Blob;

// Mock API server
// Start the mock server before all tests
beforeAll(() => server.listen());
afterEach(() => {
    // Reset handlers after each test (to clear overrides)
    server.resetHandlers();
    // Reset request trackers after each test
    resetTrackers();
});
// Stop server after all tests
afterAll(() => server.close());

// Mock window.matchMedia for Ant Design & React Router
// Reference here
// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
