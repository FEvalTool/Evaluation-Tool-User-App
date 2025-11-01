import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

import { verifyToken, refreshToken } from "../services/authServices";
import ROUTES from "../constants/routes";

const ProtectedRoute = () => {
    const [isValidate, setIsValidate] = useState(null);
    const location = useLocation();

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
    if (isValidate === null) {
        // Not complete validation, return Loading page
        return <div>Loading...</div>;
    }
    return isValidate ? (
        <Outlet />
    ) : (
        <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
    );
};

export default ProtectedRoute;
