import { http, HttpResponse } from "msw";

const healthCheckHandlers = [
    http.get(`/health/check`, async () => {
        return HttpResponse.json(
            {
                messages: "Ok",
            },
            { status: 200 }
        );
    }),
];

export default healthCheckHandlers;
