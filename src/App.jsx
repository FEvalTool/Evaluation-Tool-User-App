import { useRoutes } from "react-router-dom";
import { Suspense } from "react";

import { routes } from "./routes/index.jsx";

function AppRoutes() {
    return useRoutes(routes);
}

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AppRoutes />
        </Suspense>
    );
}

export default App;
