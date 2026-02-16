import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AuthLayout from "../../../src/layouts/AuthLayout";

describe("AuthLayout (smoke - real render)", () => {
    it("renders without crashing using real dependencies", () => {
        render(
            <MemoryRouter>
                <AuthLayout />
            </MemoryRouter>,
        );
    });
});
