import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import authService from "../services/authService";
import { ROUTES } from "../constants";

const ProtectedRoute = () => {
    const [isValidate, setIsValidate] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const validateAccessToken = async () => {
            try {
                await authService.verifyToken();
                setIsValidate(true);
            } catch (error) {
                if (
                    error.response.status === 401 ||
                    error.response.status === 400
                ) {
                    await refreshAccessToken();
                } else {
                    setIsValidate(false);
                }
            } finally {
                setIsChecking(false);
            }
        };

        const refreshAccessToken = async () => {
            try {
                await authService.refreshToken();
                await authService.verifyToken();
                setIsValidate(true);
            } catch (error) {
                setIsValidate(false);
            }
        };

        validateAccessToken();
    }, []);
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
