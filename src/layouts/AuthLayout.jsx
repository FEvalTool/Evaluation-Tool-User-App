import { Outlet, useSearchParams } from "react-router-dom";
import { ConfigProvider, Flex, Divider } from "antd";

import { BrandLogo } from "../components/CustomIcon";
import { DynamicGradientBackground } from "../components/LoginBackground";
import {
    ssoLoginConfigToken,
    ssoLoginBackgroundGradientColors,
} from "../configs/themeConfig";

const AuthLayout = () => {
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get("redirect");
    let redirectedApp = "auth";
    if (redirectUrl) {
        const url = new URL(redirectUrl);
        const hostname = url.hostname;
        const hostnameRegex = /^([a-z0-9-]+)\.eduscrum\.local$/i;
        const match = hostnameRegex.exec(hostname);
        redirectedApp = match ? match[1] : "auth";
        redirectedApp =
            redirectedApp in ssoLoginConfigToken ? redirectedApp : "auth";
    }
    return (
        <ConfigProvider theme={{ token: ssoLoginConfigToken[redirectedApp] }}>
            <div
                style={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                }}
            >
                {/* Background layer */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                        overflow: "hidden",
                    }}
                >
                    <DynamicGradientBackground
                        colorStart={
                            ssoLoginBackgroundGradientColors[redirectedApp]
                                .colorStart
                        }
                        colorEnd={
                            ssoLoginBackgroundGradientColors[redirectedApp]
                                .colorEnd
                        }
                    />
                </div>
                {/* Foreground content */}
                <Flex
                    align="flex-start"
                    style={{
                        position: "relative",
                        zIndex: 1,
                        height: "100%",
                    }}
                >
                    {/* Content here */}
                    <Flex
                        justify="center"
                        align="center"
                        style={{
                            width: "50%",
                            height: "100%",
                            backgroundColor: "rgba(245, 245, 245, 0.6)",
                            borderRight: "1.5px solid #e2e5de",
                        }}
                    >
                        <Flex
                            vertical
                            gap={10}
                            style={{
                                width: "70%",
                                maxHeight: "90%",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                borderRadius: "10px",
                                paddingLeft: "40px",
                                paddingRight: "40px",
                                paddingTop: "30px",
                                paddingBottom: "15px",
                                boxShadow:
                                    "0px 2px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            }}
                        >
                            <BrandLogo
                                fill={
                                    ssoLoginConfigToken[redirectedApp]
                                        .colorPrimary
                                }
                                size={200}
                            />
                            <Divider style={{ width: "100%", margin: "0px" }} />
                            <Outlet />
                        </Flex>
                    </Flex>
                </Flex>
            </div>
        </ConfigProvider>
    );
};

export default AuthLayout;
