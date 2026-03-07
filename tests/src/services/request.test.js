// request.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/mockServer";
import request, { injectDispatch } from "../../../src/services/request";
import { clearAuth } from "../../../src/slices/authSlice";

describe("axios interceptor - token refresh", () => {
    let mockDispatch;

    beforeEach(() => {
        mockDispatch = vi.fn();
        injectDispatch(mockDispatch);
    });

    // ─── Normal request ───────────────────────────────────────────────
    it("should return response normally on 200", async () => {
        server.use(
            http.get("/api/data", () => HttpResponse.json({ data: "ok" })),
        );

        const response = await request.get("/api/data");
        expect(response.data).toEqual({ data: "ok" });
    });

    // ─── Single 401, refresh succeeds ─────────────────────────────────
    it("should refresh token and retry original request on 401", async () => {
        let callCount = 0;
        server.use(
            http.get("/api/data", () => {
                callCount++;
                return callCount === 1
                    ? HttpResponse.json({}, { status: 401 })
                    : HttpResponse.json({ data: "ok" });
            }),
            http.post("/auth/token/refresh/", () => HttpResponse.json({})),
        );

        const response = await request.get("/api/data");
        expect(response.data).toEqual({ data: "ok" });
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    // ─── Single 401, refresh fails ────────────────────────────────────
    it("should dispatch clearAuth and reject if refresh token fails", async () => {
        server.use(
            http.get("/api/data", () => HttpResponse.json({}, { status: 401 })),
            http.post("/auth/token/refresh/", () =>
                HttpResponse.json({}, { status: 401 }),
            ),
        );

        await expect(request.get("/api/data")).rejects.toMatchObject({
            response: { status: 401 },
        });
        expect(mockDispatch).toHaveBeenCalledWith(clearAuth());
    });

    // ─── _retry guard ─────────────────────────────────────────────────
    it("should not retry more than once if retried request gets 401 again", async () => {
        let refreshCount = 0;
        server.use(
            http.get("/api/data", () => HttpResponse.json({}, { status: 401 })),
            http.post("/auth/token/refresh/", () => {
                refreshCount++;
                return HttpResponse.json({});
            }),
        );

        await expect(request.get("/api/data")).rejects.toMatchObject({
            response: { status: 401 },
        });
        expect(refreshCount).toBe(1);
    });

    // ─── Multiple simultaneous 401s ───────────────────────────────────
    it("should queue simultaneous 401 requests and retry all after refresh", async () => {
        const callCounts = { a: 0, b: 0, c: 0 };
        let refreshCount = 0;

        server.use(
            http.get("/api/a", () => {
                callCounts.a++;
                return callCounts.a === 1
                    ? HttpResponse.json({}, { status: 401 })
                    : HttpResponse.json({ data: "a" });
            }),
            http.get("/api/b", () => {
                callCounts.b++;
                return callCounts.b === 1
                    ? HttpResponse.json({}, { status: 401 })
                    : HttpResponse.json({ data: "b" });
            }),
            http.get("/api/c", () => {
                callCounts.c++;
                return callCounts.c === 1
                    ? HttpResponse.json({}, { status: 401 })
                    : HttpResponse.json({ data: "c" });
            }),
            http.post("/auth/token/refresh/", () => {
                refreshCount++;
                return HttpResponse.json({});
            }),
        );

        const [a, b, c] = await Promise.all([
            request.get("/api/a"),
            request.get("/api/b"),
            request.get("/api/c"),
        ]);

        expect(a.data).toEqual({ data: "a" });
        expect(b.data).toEqual({ data: "b" });
        expect(c.data).toEqual({ data: "c" });
        expect(refreshCount).toBe(1); // refresh only called once
    });

    // ─── Multiple simultaneous 401s, refresh fails ────────────────────
    it("should reject all queued requests and dispatch clearAuth once if refresh fails", async () => {
        server.use(
            http.get("/api/a", () => HttpResponse.json({}, { status: 401 })),
            http.get("/api/b", () => HttpResponse.json({}, { status: 401 })),
            http.post("/auth/token/refresh/", () =>
                HttpResponse.json({}, { status: 401 }),
            ),
        );

        const results = await Promise.allSettled([
            request.get("/api/a"),
            request.get("/api/b"),
        ]);

        results.forEach((result) => expect(result.status).toBe("rejected"));
        expect(mockDispatch).toHaveBeenCalledWith(clearAuth());
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    // ─── _skipInterceptor ─────────────────────────────────────────────
    it("should not queue refresh token request if it gets 401", async () => {
        let refreshCount = 0;
        server.use(
            http.get("/api/data", () => HttpResponse.json({}, { status: 401 })),
            http.post("/auth/token/refresh/", () => {
                refreshCount++;
                return HttpResponse.json({}, { status: 401 });
            }),
        );

        await expect(request.get("/api/data")).rejects.toMatchObject({
            response: { status: 401 },
        });
        expect(refreshCount).toBe(1); // not queued and retried
    });

    // ─── Non-401 errors ───────────────────────────────────────────────
    it("should not intercept non-401 errors", async () => {
        server.use(
            http.get("/api/data", () => HttpResponse.json({}, { status: 500 })),
        );

        await expect(request.get("/api/data")).rejects.toMatchObject({
            response: { status: 500 },
        });
        expect(mockDispatch).not.toHaveBeenCalled();
    });
});
