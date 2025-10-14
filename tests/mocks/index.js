import authHandlers from "./handlers/authHandlers";
import accountHandlers from "./handlers/accountHandlers";

const handlers = [...authHandlers, ...accountHandlers];

export default handlers;
