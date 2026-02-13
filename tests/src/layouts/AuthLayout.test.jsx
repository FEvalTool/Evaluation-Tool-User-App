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
import { ROUTES } from "../../../src/constants";

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

const renderFunc = (route) => {
    render(
        <MemoryRouter initialEntries={[route]}>
            <AuthLayout />
        </MemoryRouter>,
    );
};

describe("AuthLayout - (unit - prop wiring)", () => {
    const externalUrl =
        "http://course.eduscrum.local:5174/callback?redirect=/dashboard";
    const routeWithAppRedirect = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(externalUrl)}`;
    const routeWithNonAppRedirect = `${ROUTES.LOGIN}?redirect=${encodeURIComponent("https://google.com")}`;

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders with default theme when redirect to internal app", () => {
        renderFunc(ROUTES.LOGIN);

        // Assert ConfigProvider called with correct theme token
        expect(ConfigProvider).toHaveBeenCalled();
        expect(ConfigProvider.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                theme: {
                    token: ssoLoginConfigToken.auth,
                },
            }),
        );

        // Assert BrandLogo called with correct fill color
        expect(BrandLogo).toHaveBeenCalled();
        const brandLogoProps = BrandLogo.mock.calls[0][0];
        expect(brandLogoProps.fill).toBe(ssoLoginConfigToken.auth.colorPrimary);
        expect(brandLogoProps.size).toBe(200);

        // Assert DynamicGradientBackground called with correct gradient colors
        expect(DynamicGradientBackground).toHaveBeenCalled();
        const backgroundProps = DynamicGradientBackground.mock.calls[0][0];
        expect(backgroundProps.colorStart).toBe(
            ssoLoginBackgroundGradientColors.auth.colorStart,
        );
        expect(backgroundProps.colorEnd).toBe(
            ssoLoginBackgroundGradientColors.auth.colorEnd,
        );
    });

    it("renders with custom theme when redirect to same ecosystem app URL", () => {
        renderFunc(routeWithAppRedirect);

        // Assert ConfigProvider called with correct theme token
        expect(ConfigProvider).toHaveBeenCalled();
        expect(ConfigProvider.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                theme: {
                    token: ssoLoginConfigToken.course,
                },
            }),
        );

        // Assert BrandLogo called with correct fill color
        expect(BrandLogo).toHaveBeenCalled();
        const brandLogoProps = BrandLogo.mock.calls[0][0];
        expect(brandLogoProps.fill).toBe(
            ssoLoginConfigToken.course.colorPrimary,
        );
        expect(brandLogoProps.size).toBe(200);

        // Assert DynamicGradientBackground called with correct gradient colors
        expect(DynamicGradientBackground).toHaveBeenCalled();
        const backgroundProps = DynamicGradientBackground.mock.calls[0][0];
        expect(backgroundProps.colorStart).toBe(
            ssoLoginBackgroundGradientColors.course.colorStart,
        );
        expect(backgroundProps.colorEnd).toBe(
            ssoLoginBackgroundGradientColors.course.colorEnd,
        );
    });

    it("renders with default theme when redirect to same ecosystem app URL but no theme config provided for that app", () => {
        renderFunc(routeWithNonAppRedirect);

        // Assert ConfigProvider called with correct theme token
        expect(ConfigProvider).toHaveBeenCalled();
        expect(ConfigProvider.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                theme: {
                    token: ssoLoginConfigToken.auth,
                },
            }),
        );

        // Assert BrandLogo called with correct fill color
        expect(BrandLogo).toHaveBeenCalled();
        const brandLogoProps = BrandLogo.mock.calls[0][0];
        expect(brandLogoProps.fill).toBe(ssoLoginConfigToken.auth.colorPrimary);
        expect(brandLogoProps.size).toBe(200);

        // Assert DynamicGradientBackground called with correct gradient colors
        expect(DynamicGradientBackground).toHaveBeenCalled();
        const backgroundProps = DynamicGradientBackground.mock.calls[0][0];
        expect(backgroundProps.colorStart).toBe(
            ssoLoginBackgroundGradientColors.auth.colorStart,
        );
        expect(backgroundProps.colorEnd).toBe(
            ssoLoginBackgroundGradientColors.auth.colorEnd,
        );
    });

    it("renders with default theme when redirect to other URL", () => {
        renderFunc(routeWithNonAppRedirect);

        // Assert ConfigProvider called with correct theme token
        expect(ConfigProvider).toHaveBeenCalled();
        expect(ConfigProvider.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                theme: {
                    token: ssoLoginConfigToken.auth,
                },
            }),
        );

        // Assert BrandLogo called with correct fill color
        expect(BrandLogo).toHaveBeenCalled();
        const brandLogoProps = BrandLogo.mock.calls[0][0];
        expect(brandLogoProps.fill).toBe(ssoLoginConfigToken.auth.colorPrimary);
        expect(brandLogoProps.size).toBe(200);

        // Assert DynamicGradientBackground called with correct gradient colors
        expect(DynamicGradientBackground).toHaveBeenCalled();
        const backgroundProps = DynamicGradientBackground.mock.calls[0][0];
        expect(backgroundProps.colorStart).toBe(
            ssoLoginBackgroundGradientColors.auth.colorStart,
        );
        expect(backgroundProps.colorEnd).toBe(
            ssoLoginBackgroundGradientColors.auth.colorEnd,
        );
    });
});
