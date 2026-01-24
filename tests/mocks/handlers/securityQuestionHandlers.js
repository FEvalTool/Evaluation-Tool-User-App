import { http, HttpResponse } from "msw";
import { securityQuestionsResponse } from "../data/account";

const API_URL = "/security_question";

const createSecurityQuestionsHandlers = ({
    requestCallTracker,
    REQUEST_KEYS,
}) => [
    http.get(`${API_URL}`, async () => {
        requestCallTracker.track(REQUEST_KEYS.GET_SECURITY_QUESTIONS);
        return HttpResponse.json(
            {
                messages: "Retrieve security questions successful",
                data: securityQuestionsResponse,
            },
            { status: 200 },
        );
    }),
];

export default createSecurityQuestionsHandlers;
