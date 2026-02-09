import { theme } from "antd";

export const appThemeConfig = {
    algorithm: theme.defaultAlgorithm,

    token: {
        colorPrimary: "#7C3AED",
        colorSuccess: "#059669",
        colorWarning: "#F59E0B",
        colorError: "#EF4444",
        colorInfo: "#0891B2",
    },

    components: {
        Menu: {
            itemBg: "#E6DCFF",
            popupBg: "#E6DCFF",

            itemColor: "#111827",
            itemIconColor: "#4B5563",

            itemHoverBg: "#D6C9FF",
            itemHoverColor: "#4C1D95",
            itemHoverIconColor: "#4C1D95",

            itemSelectedBg: "#B9A8FF",
            itemSelectedColor: "#3B168A",
            itemSelectedIconColor: "#3B168A",

            itemDisabledColor: "#9CA3AF",

            dividerColor: "#C7B8FF",
            groupTitleColor: "#312E81",

            iconSize: 20,
            itemHeight: 60,
        },
        Layout: {
            headerBg: "#F3EFFF",
            headerColor: "#312E81",
            bodyBg: "#F7F4FF",
        },
        Progress: {
            defaultColor: "#5B21B6",
            remainingColor: "#D6C9FF",
            circleTextColor: "#111111",
        },
    },
};

export const ssoLoginPrimaryColor = {
    auth: "#7C3AED",
};

export const ssoLoginBackgroundGradientColors = {
    auth: { colorStart: "#2563EB", colorEnd: "#7C3AED" },
};
