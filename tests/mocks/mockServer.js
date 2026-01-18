import { setupServer } from "msw/node";
import {
    createResponseQueue,
    createRequestCallTracker,
    createRequestValidationErrorTracker,
} from "../helpers/requestHelpers";
import { REQUEST_KEYS } from "../helpers/requestHelpers";
import createAuthHandlers from "./handlers/authHandlers";
import createAccountHandlers from "./handlers/accountHandlers";
import createSecurityQuestionsHandlers from "./handlers/securityQuestionHandlers";
import createHealthCheckHandlers from "./handlers/healthCheckHandlers";

// Create shared instances
export const responseQueue = createResponseQueue();
export const requestCallTracker = createRequestCallTracker();
export const requestValidationErrorTracker =
    createRequestValidationErrorTracker();

// Helper function to reset all trackers
export const resetTrackers = () => {
    responseQueue.clear();
    requestCallTracker.reset();
    requestValidationErrorTracker.reset();
};

// This configures a request mocking server with the given request handlers
const handlers = [
    ...createAuthHandlers({
        responseQueue,
        requestCallTracker,
        requestValidationErrorTracker,
        REQUEST_KEYS,
    }),
    ...createAccountHandlers({
        responseQueue,
        requestCallTracker,
        requestValidationErrorTracker,
        REQUEST_KEYS,
    }),
    ...createSecurityQuestionsHandlers({ requestCallTracker, REQUEST_KEYS }),
    ...createHealthCheckHandlers(),
];
export const server = setupServer(...handlers);
