// handle form api submit loading state without wrapping API in createAsyncThunk
export const withFormSubmit = async (
    apiCall,
    setLoading,
    dispatch,
    showMessage
) => {
    try {
        setLoading(true);
        const response = await apiCall();
        return response;
    } catch (error) {
        if (dispatch && showMessage) {
            dispatch(
                showMessage({
                    type: "error",
                    content:
                        error.response?.data?.message || "Something went wrong",
                })
            );
        }
    } finally {
        setLoading(false);
    }
};
