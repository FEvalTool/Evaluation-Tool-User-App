import { http, HttpResponse } from "msw";
import { securityQuestionsResponse } from "../data/account";

const API_URL = "/question";

const securityQuestionsHandlers = [
    http.get(`${API_URL}`, async ({ request }) => {
        return HttpResponse.json(
            {
                messages: "Retrieve security questions successful",
                questions: securityQuestionsResponse,
            },
            { status: 200 }
        );
    }),
];

export default securityQuestionsHandlers;
