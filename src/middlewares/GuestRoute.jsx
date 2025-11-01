import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

import { verifyToken, refreshToken } from "../services/authServices";
import ROUTES from "../constants/routes";

const GuestRoute = () => {
    const [isValidate, setIsValidate] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const validateAccessToken = async () => {
            try {
                await verifyToken();
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
                await refreshToken();
                await verifyToken();
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
