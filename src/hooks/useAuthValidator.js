import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import authService from "../services/authService";

export default function useAuthValidator() {
    const [isValidate, setIsValidate] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const { user } = useSelector((state) => state.auth);

    const userId = user?.id ?? null;
    const tokenType = user.first_time_setup ? "scope" : "access";

    useEffect(() => {
        const run = async () => {
            try {
                await authService.verifyToken(tokenType);
                setIsValidate(true);
            } catch {
                setIsValidate(false);
            } finally {
                setIsChecking(false);
            }
        };

        run();
    }, [userId, tokenType]);

    return { isValidate, isChecking, user };
}
