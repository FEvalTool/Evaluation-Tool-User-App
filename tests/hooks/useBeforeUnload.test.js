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

    it("calls deleteScopeTokenBeacon on beforeunload", () => {
        const spy = vi.spyOn(authService, "deleteScopeTokenBeacon");

        // Render the hook with shouldWarn = true
        renderHook(() => useBeforeUnload());

        const event = new Event("beforeunload");
        event.preventDefault = vi.fn();

        window.dispatchEvent(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });
});
