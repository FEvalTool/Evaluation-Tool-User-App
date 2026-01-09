export const REQUEST_KEYS = {
    LOGIN: "auth.login",
    LOGOUT: "auth.logout",
    DELETE_SCOPE_TOKEN: "auth.deleteScopeToken",
    GEN_SECURITY_TOKEN_QA: "auth.genSecurityQAVerificationToken",
    VERIFY_TOKEN: "auth.verifyToken",
    REFRESH_TOKEN: "auth.refreshToken",

    GET_USER_SECURITY_QA: "account.getUserSecurityQuestions",
    GET_USER_SETUP_STATUS: "account.getUserSetupStatus",
    SET_SECURITY_QA: "account.setSecurityQA",
    SET_PASSWORD: "account.setPassword",

    GET_SECURITY_QUESTIONS: "question.getSecurityQuestions",
};

export const requestCallTracker = {
    calls: {},

    track(key) {
        this.calls[key] = (this.calls[key] ?? 0) + 1;
    },

    get(key) {
        return this.calls[key] ?? 0;
    },

    reset() {
        this.calls = {};
    },
};

export const requestValidationErrorTracker = {
    errors: [],

    record(error) {
        this.errors.push(error);
    },

    getAll() {
        return this.errors;
    },

    getByEndpoint(endpoint) {
        return this.errors.filter((e) => e.endpoint === endpoint);
    },

    reset() {
        this.errors = [];
    },
};
