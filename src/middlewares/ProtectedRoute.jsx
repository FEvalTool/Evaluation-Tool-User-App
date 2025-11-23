import { Outlet, Navigate, useLocation } from "react-router-dom";

import useAuthValidator from "../hooks/useAuthValidator";
import { ROUTES } from "../constants";

const ProtectedRoute = () => {
    const { isValidate, isChecking, user } = useAuthValidator();
    const location = useLocation();

    if (isChecking) {
        return <div>Loading...</div>;
    }
    if (isValidate) {
        if (
            user["first_time_setup"] &&
            location.pathname !== ROUTES.SETUP_ACCOUNT
        ) {
            return <Navigate to={ROUTES.SETUP_ACCOUNT} replace />;
        }
        if (
            !user["first_time_setup"] &&
            location.pathname === ROUTES.SETUP_ACCOUNT
        ) {
            return <Navigate to={ROUTES.TEST_MAIN} replace />;
        }
        return <Outlet />;
    }
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
};

export default ProtectedRoute;
