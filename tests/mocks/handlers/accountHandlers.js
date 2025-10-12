import { http, HttpResponse } from "msw";
import { securityQuestionsResponse } from "../data/account";

const API_URL = "/account";

const accountHandlers = [
    http.get(`${API_URL}/security_questions`, async ({ request }) => {
        const url = new URL(request.url);
        const params = Object.fromEntries(url.searchParams.entries());
        if (params.username === "testuser") {
            return HttpResponse.json(
                {
                    messages: "Retrieve user security questions successful",
                    questions: securityQuestionsResponse,
                },
                { status: 200 }
            );
        }
        return HttpResponse.json(
            { message: "User does not exist" },
            { status: 404 }
        );
    }),
    http.post(`${API_URL}/password`, async ({ request }) => {
        return HttpResponse.json(
            {
                messages: "Set new password success",
                questions: securityQuestionsResponse,
            },
            { status: 200 }
        );
    }),
];

export default accountHandlers;
