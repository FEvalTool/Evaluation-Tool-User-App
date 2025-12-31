import { renderHook } from "@testing-library/react";
import useBeforeUnload from "../../src/hooks/useBeforeUnload";
import authService from "../../src/services/authService";

describe("useBeforeUnload", () => {
    beforeAll(() => {
        Object.defineProperty(navigator, "sendBeacon", {
            value: vi.fn(),
            writable: true,
        });
    });

    it("should call deleteScopeTokenBeacon on beforeunload (shouldWarn = true)", () => {
        const spy = vi.spyOn(authService, "deleteScopeTokenBeacon");

        // Render the hook with shouldWarn = true
        renderHook(() => useBeforeUnload(true));

        const event = new Event("beforeunload");
        event.preventDefault = vi.fn();

        window.dispatchEvent(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it("should not call deleteScopeTokenBeacon on beforeunload (shouldWarn = false)", () => {
        const spy = vi.spyOn(authService, "deleteScopeTokenBeacon");

        // Render the hook with shouldWarn = false
        renderHook(() => useBeforeUnload(false));

        const event = new Event("beforeunload");
        event.preventDefault = vi.fn();

        window.dispatchEvent(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
    });
});
