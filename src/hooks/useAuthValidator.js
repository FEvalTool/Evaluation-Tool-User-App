import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import authService from "../services/authService";

export default function useAuthValidator() {
    const [isValidate, setIsValidate] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const tokenType = user.first_time_setup ? "scope" : "access";
        const run = async () => {
            try {
                await validate();
                setIsValidate(true);
            } catch {
                setIsValidate(false);
            } finally {
                setIsChecking(false);
            }
        };

        const validate = async () => {
            try {
                await authService.verifyToken(tokenType);
            } catch (error) {
                if (
                    (error?.response?.status === 401 ||
                        error?.response?.status === 400) &&
                    tokenType === "access"
                ) {
                    await refreshAccessToken();
                } else {
                    throw error;
                }
            }
        };

        const refreshAccessToken = async () => {
            await authService.refreshToken();
            await authService.verifyToken("access");
        };

        run();
    }, [user]);

    return { isValidate, isChecking, user };
}
