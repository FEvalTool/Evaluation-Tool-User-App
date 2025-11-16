import { useEffect } from "react";

import authService from "../services/authService";

function useBeforeUnload(shouldWarn) {
    useEffect(() => {
        if (!shouldWarn) return;

        const callback = (e) => {
            e.preventDefault();
            e.returnValue = ""; // Required in Chrome
            authService.deleteScopeTokenBeacon();
        };

        window.addEventListener("beforeunload", callback);
        return () => window.removeEventListener("beforeunload", callback);
    }, [shouldWarn]);
}

export default useBeforeUnload;
