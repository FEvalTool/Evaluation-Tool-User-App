import { http, HttpResponse } from "msw";
import {
    setPasswordSchema,
    setSecurityQASchema,
} from "../../schemas/accountSchema";
import { securityQuestionsResponse } from "../data/account";

const API_URL = "/account";

const createAccountHandlers = ({
    responseQueue,
    requestCallTracker,
    requestValidationErrorTracker,
    REQUEST_KEYS,
}) => [
    http.get(`${API_URL}/security_questions`, async ({ request }) => {
        requestCallTracker.track(REQUEST_KEYS.GET_USER_SECURITY_QA);
        const url = new URL(request.url);
        const params = Object.fromEntries(url.searchParams.entries());
        if (params.username === "testuser") {
            return HttpResponse.json(
                {
                    messages: "Retrieve user security questions successful",
                    data: securityQuestionsResponse,
                },
                { status: 200 },
            );
        }
        return HttpResponse.json(
            { message: "User does not exist" },
            { status: 404 },
        );
    }),
    http.post(`${API_URL}/password`, async ({ request }) => {
        requestCallTracker.track(REQUEST_KEYS.SET_PASSWORD);
        const body = await request.json();
        const validation = setPasswordSchema.safeParse(body);
        if (!validation.success) {
            requestValidationErrorTracker.record({
                endpoint: REQUEST_KEYS.SET_PASSWORD,
                issues: validation.error.issues,
                payload: body,
            });
            return HttpResponse.json(
                { message: "Invalid request payload" },
                { status: 400 },
            );
        }

        if (responseQueue.has(REQUEST_KEYS.SET_PASSWORD)) {
            const response = responseQueue.next(REQUEST_KEYS.SET_PASSWORD);
            return HttpResponse.json(response.data, {
                status: response.status,
            });
        }

        return HttpResponse.json(
            {
                messages: "Set new password success",
            },
            { status: 200 },
        );
    }),
    http.post(`${API_URL}/security_questions`, async ({ request }) => {
        requestCallTracker.track(REQUEST_KEYS.SET_SECURITY_QA);
        const body = await request.json();
        const validation = setSecurityQASchema.safeParse(body);
        if (!validation.success) {
            requestValidationErrorTracker.record({
                endpoint: REQUEST_KEYS.SET_SECURITY_QA,
                issues: validation.error.issues,
                payload: body,
            });
            return HttpResponse.json(
                { message: "Invalid request payload" },
                { status: 400 },
            );
        }

        if (responseQueue.has(REQUEST_KEYS.SET_SECURITY_QA)) {
            const response = responseQueue.next(REQUEST_KEYS.SET_SECURITY_QA);
            return HttpResponse.json(response.data, {
                status: response.status,
            });
        }

        return HttpResponse.json(
            {
                messages: "Set security questions success",
            },
            { status: 200 },
        );
    }),
    http.get("account/setup_status", () => {
        requestCallTracker.track(REQUEST_KEYS.GET_ACCOUNT_SETUP_STATUS);
        const response = responseQueue.next(
            REQUEST_KEYS.GET_ACCOUNT_SETUP_STATUS,
        );
        return HttpResponse.json(response.data, {
            status: response.status,
        });
    }),
];

export default createAccountHandlers;
