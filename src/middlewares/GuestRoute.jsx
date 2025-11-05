import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

import authService from "../services/authService";
import { ROUTES } from "../constants";

const GuestRoute = () => {
    const [isValidate, setIsValidate] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

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
    return isValidate ? <Navigate to={ROUTES.TEST_MAIN} replace /> : <Outlet />;
};

export default GuestRoute;
