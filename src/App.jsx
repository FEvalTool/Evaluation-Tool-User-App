import { Suspense } from "react";
import { useRoutes } from "react-router-dom";

import MessageWrapper from "./components/MessageWrapper.jsx";
import PageLoading from "./components/PageLoading.jsx";
import { routes } from "./routes.jsx";

function AppRoutes() {
    return useRoutes(routes);
}

function App() {
    return (
        <MessageWrapper>
            <Suspense fallback={<PageLoading />}>
                <AppRoutes />
            </Suspense>
        </MessageWrapper>
    );
}

export default App;
