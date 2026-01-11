import { http, HttpResponse } from "msw";

const createHealthCheckHandlers = () => [
    http.get(`/health/check`, async () => {
        return HttpResponse.json(
            {
                messages: "Ok",
            },
            { status: 200 }
        );
    }),
];

export default createHealthCheckHandlers;
