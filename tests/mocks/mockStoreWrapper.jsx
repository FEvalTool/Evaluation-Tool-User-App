import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../../src/slices/authSlice";
import messageReducer from "../../src/slices/messageSlice";

export function renderWithProviders(
    ui,
    {
        preloadedState = {},
        store = configureStore({
            reducer: { auth: authReducer, message: messageReducer },
            preloadedState,
        }),
        route = "/",
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
            </Provider>
        );
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
