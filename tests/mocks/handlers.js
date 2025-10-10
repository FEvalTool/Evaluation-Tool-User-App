// src/mocks/handlers.js
import { http, HttpResponse } from "msw";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
export const handlers = [
    http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
        const { username, password } = await request.json();
        console.log("payload:", username, password);
        if (username === "testuser" && password === "testpassword") {
            return HttpResponse.json(
                {
                    access_token: "fake-access-token",
                    refresh_token: "fake-refresh-token",
                },
                { status: 200 }
            );
        }
        return HttpResponse.json(
            { message: "Invalid username or password" },
            { status: 401 }
        );
    }),
];
