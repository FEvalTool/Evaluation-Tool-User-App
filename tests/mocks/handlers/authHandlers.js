import { http, HttpResponse } from "msw";
import { securityAnswers } from "../data/account";

const API_URL = "/auth"

const authHandlers = [
    http.post(`${API_URL}/login`, async ({ request }) => {
        const { username, password } = await request.json();
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
    http.post(`${API_URL}/token/qa`, async ({ request }) => {
        const { questions, answers, username } = await request.json();
        for (let i = 0; i < answers.length; i++) {
            if (answers[i] != securityAnswers[i]) {
                return HttpResponse.json(
                    { message: "Security QA validation failed" },
                    { status: 401 }
                );
            }
        }
        return HttpResponse.json(
            {
                message: "Successfully retrieve Security QA verification token",
                token: "fake-refresh-token",
            },
            { status: 200 }
        );
    }),
];

export default authHandlers;
