import { vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

import AuthLayout from "../../../src/layouts/AuthLayout";
import { BrandLogo } from "../../../src/components/CustomIcon";
import { DynamicGradientBackground } from "../../../src/components/LoginBackground";
import {
    ssoLoginConfigToken,
    ssoLoginBackgroundGradientColors,
} from "../../../src/configs/themeConfig";

// Mock ConfigProvider from antd
vi.mock("antd", async () => {
    const actual = await vi.importActual("antd");

    return {
        ...actual,
        ConfigProvider: vi.fn(({ children }) => <>{children}</>),
    };
});

// Mock BrandLogo and DynamicGradientBackground components
vi.mock("../../../src/components/LoginBackground", () => ({
    DynamicGradientBackground: vi.fn(() => null),
}));

vi.mock("../../../src/components/CustomIcon", () => ({
    BrandLogo: vi.fn(() => null),
}));

describe("AuthLayout - (unit - prop wiring)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <MemoryRouter>
                <AuthLayout />
            </MemoryRouter>,
        );
    });

    // Test default case
    it("passes correct primary color token to ConfigProvider", () => {
        expect(ConfigProvider).toHaveBeenCalled();

        const props = ConfigProvider.mock.calls[0][0];

        expect(props).toEqual(
            expect.objectContaining({
                theme: {
                    token: ssoLoginConfigToken.auth,
                },
            }),
        );
    });

    it("renders BrandLogo with correct fill color", () => {
        expect(BrandLogo).toHaveBeenCalled();

        const props = BrandLogo.mock.calls[0][0];

        expect(props.fill).toBe(ssoLoginConfigToken.auth.colorPrimary);
        expect(props.size).toBe(200);
    });

    it("passes correct gradient colors to DynamicGradientBackground", () => {
        expect(DynamicGradientBackground).toHaveBeenCalled();

        const props = DynamicGradientBackground.mock.calls[0][0];

        expect(props.colorStart).toBe(
            ssoLoginBackgroundGradientColors.auth.colorStart,
        );
        expect(props.colorEnd).toBe(
            ssoLoginBackgroundGradientColors.auth.colorEnd,
        );
    });
});
