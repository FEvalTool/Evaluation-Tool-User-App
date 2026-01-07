import authHandlers from "./handlers/authHandlers";
import accountHandlers from "./handlers/accountHandlers";
import securityQuestionsHandlers from "./handlers/securityQuestionHandlers";
import healthCheckHandlers from "./handlers/healthCheckHandlers";

const handlers = [
    ...authHandlers,
    ...accountHandlers,
    ...securityQuestionsHandlers,
    ...healthCheckHandlers,
];

export default handlers;
