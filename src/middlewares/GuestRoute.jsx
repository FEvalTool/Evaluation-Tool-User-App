import { Outlet, Navigate } from "react-router-dom";

import useAuthValidator from "../hooks/useAuthValidator";
import { ROUTES } from "../constants";
import PageLoading from "../components/PageLoading";

const GuestRoute = () => {
    const { isValidate, isChecking } = useAuthValidator();

    if (isChecking) {
        return <PageLoading />;
    }
    return isValidate ? <Navigate to={ROUTES.TEST_MAIN} replace /> : <Outlet />;
};

export default GuestRoute;
