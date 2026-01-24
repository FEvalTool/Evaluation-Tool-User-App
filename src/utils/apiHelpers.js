// handle form api submit loading state without wrapping API in createAsyncThunk
export const withFormSubmit = async (
    apiCall,
    setLoading,
    dispatch,
    showMessage,
) => {
    try {
        setLoading(true);
        const response = await apiCall();
        return response;
    } catch (error) {
        if (dispatch && showMessage) {
            const apiError = error.response?.data;
            dispatch(
                showMessage({
                    type: "error",
                    message: apiError?.message || "Something went wrong",
                    code: apiError?.code,
                    error: apiError?.error,
                }),
            );
        }
        throw error;
    } finally {
        setLoading(false);
    }
};
