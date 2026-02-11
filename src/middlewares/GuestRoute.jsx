import { Outlet, Navigate, useLocation } from "react-router-dom";

import useAuthValidator from "../hooks/useAuthValidator";
import { ROUTES } from "../constants";
import PageLoading from "../components/PageLoading";

const GuestRoute = () => {
    const location = useLocation();
    const { isValidate, isChecking, user } = useAuthValidator();

    if (isChecking) {
        return <PageLoading />;
    }
    if (isValidate) {
        // Priority 1: Setup account redirect
        if (user?.first_time_setup) {
            return <Navigate to={ROUTES.SETUP_ACCOUNT} replace />;
        }

        // Priority 2: External redirect (SSO flow)
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get("redirect");
        if (redirectUrl) {
            window.location.replace(redirectUrl);
            return <PageLoading />;
        }

        // Priority 3: Internal redirect
        const from = location.state?.from?.pathname || ROUTES.TEST_MAIN;
        return <Navigate to={from} replace />;
    }
    return <Outlet />;
};

export default GuestRoute;
