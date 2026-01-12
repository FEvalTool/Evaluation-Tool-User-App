import { useEffect } from "react";

import authService from "../services/authService";

export default function useBeforeUnload(shouldWarn) {
    useEffect(() => {
        // If shouldWarn false, no notification display
        if (!shouldWarn) return;
        // Else, display notification to delete scope token
        const callback = (e) => {
            e.preventDefault();
            e.returnValue = ""; // Required in Chrome
            authService.deleteScopeTokenBeacon();
        };

        window.addEventListener("beforeunload", callback);
        return () => window.removeEventListener("beforeunload", callback);
    }, []);
}
