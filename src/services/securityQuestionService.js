import request from "./request";

const API_URL = "/question";

const getSecurityQuestions = (params) => {
    return request.get(`${API_URL}`, {"params": params});
};

const securityQuestionService = {
    getSecurityQuestions
};

export default securityQuestionService;