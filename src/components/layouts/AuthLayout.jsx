import { Outlet } from "react-router-dom";
import { Flex, Divider } from "antd";
import Icon from "@ant-design/icons";

import Background from "../../assets/auth_bg_image.jpg";
import Logo from "../../assets/logo_fpt.png";

const AuthLayout = () => {
    return (
        <Flex
            style={{
                width: "100vw",
                height: "100vh",
            }}
            gap="middle"
            align="center"
        >
            <Flex
                style={{
                    width: "100%",
                    height: "100%",
                }}
                justify="center"
                align="center"
            >
                <div
                    style={{
                        backgroundImage: `url("${Background}")`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        align: "start",
                    }}
                >
                    <div
                        style={{
                            width: "50%",
                            height: "100%",
                            backgroundColor: "#f5f5f5",
                            borderRight: "1.5px solid #e2e5de",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "60%",
                                maxHeight: "90%",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                borderRadius: "10px",
                                paddingLeft: "40px",
                                paddingRight: "40px",
                                paddingTop: "30px",
                                paddingBottom: "15px",
                                borderRadius: "10px",
                                boxShadow:
                                    "0px 2px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            <Icon
                                component={() => (
                                    <img
                                        src={Logo}
                                        style={{
                                            width: "5vw",
                                            height: "auto",
                                        }}
                                        alt="logo_fpt"
                                    />
                                )}
                            />
                            <Divider style={{ width: "100%", margin: "0px" }} />
                            <Outlet />
                        </div>
                    </div>
                </div>
            </Flex>
        </Flex>
    );
};

export default AuthLayout;
