export const REQUEST_KEYS = {
    LOGIN: "auth.login",
    LOGOUT: "auth.logout",
    DELETE_SCOPE_TOKEN: "auth.deleteScopeToken",
    GEN_SECURITY_TOKEN_QA: "auth.genSecurityQAVerificationToken",
    VERIFY_TOKEN: "auth.verifyToken",
    REFRESH_TOKEN: "auth.refreshToken",

    GET_USER_SECURITY_QA: "account.getUserSecurityQuestions",
    GET_ACCOUNT_SETUP_STATUS: "account.getUserSetupStatus",
    SET_SECURITY_QA: "account.setSecurityQA",
    SET_PASSWORD: "account.setPassword",

    GET_SECURITY_QUESTIONS: "question.getSecurityQuestions",
};

export const createRequestCallTracker = () => {
    const calls = new Map();
    return {
        track: (key) => {
            calls.set(key, (calls.get(key) ?? 0) + 1);
        },
        get: (key) => {
            return calls.get(key) ?? 0;
        },
        reset: () => {
            calls.clear();
        },
    };
};

export const createRequestValidationErrorTracker = () => {
    const errors = [];

    return {
        record: (error) => {
            errors.push(error);
        },
        getAll: () => {
            return errors;
        },
        reset: () => {
            errors.length = 0;
        },
    };
};

export const createResponseQueue = () => {
    const queues = new Map();

    return {
        add: (key, status, data = {}) => {
            if (!queues.has(key)) {
                queues.set(key, []);
            }
            queues.get(key).push({ status, data });
        },
        next: (key) => {
            const queue = queues.get(key);
            if (!queue || queue.length === 0) {
                console.warn(
                    `⚠️ No response queued for ${key}, returning default 200`,
                );
                return { status: 200, data: {} };
            }
            const response = queue.shift();
            console.log(
                `✅ [${key}] Returning status ${response.status}, ${queue.length} remaining`,
            );
            return response;
        },
        has: (key) => {
            const queue = queues.get(key);
            return queue && queue.length > 0;
        },
        clear: () => {
            queues.clear();
        },
        // For debugging purposes
        getAll: () => {
            return queues;
        },
    };
};
