import authHandlers from "./handlers/authHandlers";
import accountHandlers from "./handlers/accountHandlers";
import securityQuestionsHandlers from "./handlers/securityQuestionHandlers";

const handlers = [
    ...authHandlers,
    ...accountHandlers,
    ...securityQuestionsHandlers,
];

export default handlers;
