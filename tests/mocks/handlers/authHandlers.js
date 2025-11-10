import { http, HttpResponse } from "msw";
import { securityAnswers, accountData } from "../data/account";

const API_URL = "/auth";

const authHandlers = [
    http.post(`${API_URL}/login`, async ({ request }) => {
        const { username, password } = await request.json();
        const userInfo = accountData.filter((user) => user.username === username);
        if (userInfo.length != 0) {
            if (password === userInfo[0].password) {
                return HttpResponse.json(
                    {user: userInfo[0]},
                    { status: 200 }
                );
            }
        }
        return HttpResponse.json(
            { message: "Invalid username or password" },
            { status: 401 }
        );
    }),
    http.post(`${API_URL}/token/qa`, async ({ request }) => {
        const data = await request.json();
        const { answers } = data;
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
