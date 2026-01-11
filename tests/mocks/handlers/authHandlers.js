import { http, HttpResponse } from "msw";
import { securityAnswers, accountData } from "../data/account";
import {
    loginSchema,
    genTokenQASchema,
    verifyTokenSchema,
} from "../../schemas/authSchema";

const API_URL = "/auth";

const createAuthHandlers = ({
    responseQueue,
    requestCallTracker,
    requestValidationErrorTracker,
    REQUEST_KEYS,
}) => [
    http.post(`${API_URL}/login`, async ({ request }) => {
        requestCallTracker.track(REQUEST_KEYS.LOGIN);
        const body = await request.json();
        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            requestValidationErrorTracker.record({
                endpoint: REQUEST_KEYS.LOGIN,
                issues: validation.error.issues,
                payload: body,
            });
            return HttpResponse.json(
                { message: "Invalid request payload" },
                { status: 400 }
            );
        }

        const userInfo = accountData.filter(
            (user) => user.username === body.username
        );
        if (userInfo.length != 0) {
            if (body.password === userInfo[0].password) {
                return HttpResponse.json(
                    { user: userInfo[0] },
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
        requestCallTracker.track(REQUEST_KEYS.GEN_SECURITY_TOKEN_QA);
        const body = await request.json();
        const validation = genTokenQASchema.safeParse(body);
        if (!validation.success) {
            requestValidationErrorTracker.record({
                endpoint: REQUEST_KEYS.GEN_SECURITY_TOKEN_QA,
                issues: validation.error.issues,
                payload: body,
            });
            return HttpResponse.json(
                { message: "Invalid request payload" },
                { status: 400 }
            );
        }

        const { answers } = body;
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
                exp: Date.now() + 10 * 60 * 1000, // 10 minute expirity
            },
            { status: 200 }
        );
    }),
    http.post(`${API_URL}/token/scope/delete`, async () => {
        requestCallTracker.track(REQUEST_KEYS.DELETE_SCOPE_TOKEN);
        return HttpResponse.json(
            { message: "Token scope delete successfully" },
            { status: 200 }
        );
    }),
    http.post(`${API_URL}/logout`, async () => {
        requestCallTracker.track(REQUEST_KEYS.LOGOUT);
        if (responseQueue.has(REQUEST_KEYS.LOGOUT)) {
            const response = responseQueue.next(REQUEST_KEYS.LOGOUT);
            return HttpResponse.json(response.data, {
                status: response.status,
            });
        }
        return HttpResponse.json(
            { message: "Logout successfully" },
            { status: 200 }
        );
    }),
    http.post(`${API_URL}/token/verify`, async ({ request }) => {
        const body = await request.json();
        const validation = verifyTokenSchema.safeParse(body);
        if (!validation.success) {
            requestValidationErrorTracker.record({
                endpoint: REQUEST_KEYS.VERIFY_TOKEN,
                issues: validation.error.issues,
                payload: body,
            });
            return HttpResponse.json(
                { message: "Invalid request payload" },
                { status: 400 }
            );
        }

        requestCallTracker.track(REQUEST_KEYS.VERIFY_TOKEN);
        const response = responseQueue.next(REQUEST_KEYS.VERIFY_TOKEN);
        return HttpResponse.json(response.data, {
            status: response.status,
        });
    }),
    http.post(`${API_URL}/token/refresh`, async () => {
        requestCallTracker.track(REQUEST_KEYS.REFRESH_TOKEN);
        const response = responseQueue.next(REQUEST_KEYS.REFRESH_TOKEN);
        return HttpResponse.json(response.data, {
            status: response.status,
        });
    }),
];

export default createAuthHandlers;
