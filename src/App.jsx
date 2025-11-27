import { Suspense } from "react";
import { useRoutes } from "react-router-dom";

import MessageWrapper from "./components/MessageWrapper.jsx";
import { routes } from "./routes.jsx";

function AppRoutes() {
    return useRoutes(routes);
}

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MessageWrapper>
                <AppRoutes />
            </MessageWrapper>
        </Suspense>
    );
}

export default App;
