export const PASSWORD_PATTERN = [
    {
        pattern: /[a-z]/,
        message: "Password must contain at least one lowercase letter",
    },
    {
        pattern: /[A-Z]/,
        message: "Password must contain at least one uppercase letter",
    },
    {
        pattern: /\d/,
        message: "Password must contain at least one digit",
    },
    {
        pattern: /[@$!%*?&]/,
        message: "Password must contain at least one special character",
    },
    {
        min: 12,
        message: "Password must be at least 12 characters long",
    },
];

export const PASSWORD_PATTERN_TOOLTIP =
    "Password must be at least 12 characters long, including one uppercase letter, one lowercase letter, one number, and one special character."; // NOSONAR

export const ANSWER_KEY_PREFIX = "answer-";
export const QUESTION_KEY_PREFIX = "question-"

export const ROUTES = {
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password", // NOSONAR
    TEST_AUTH: "/auth/test",
    TEST_MAIN: "/test",
    SETUP_ACCOUNT: "/setup-account",
};
