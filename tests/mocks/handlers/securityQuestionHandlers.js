import { http, HttpResponse } from "msw";
import { securityQuestionsResponse } from "../data/account";
import { requestCallTracker, REQUEST_KEYS } from "../../helpers/requestHelpers";

const API_URL = "/question";

const securityQuestionsHandlers = [
    http.get(`${API_URL}`, async () => {
        requestCallTracker.track(REQUEST_KEYS.GET_SECURITY_QUESTIONS);
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
