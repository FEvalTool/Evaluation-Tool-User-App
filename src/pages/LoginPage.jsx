import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Flex, Typography } from "antd";

import { login } from "../slices/authSlice";
import UsernamePasswordForm from "../components/forms/UsernamePasswordForm";
import { ROUTES } from "../constants";

const { Text, Title, Link } = Typography;

const LoginPage = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    const onSubmitLogin = (values) => {
        dispatch(login(values));
    };

    // Build forgot password URL with redirect param preserved
    const redirectUrl = searchParams.get("redirect");
    const forgotPasswordUrl = redirectUrl
        ? `${ROUTES.FORGOT_PASSWORD}?redirect=${encodeURIComponent(redirectUrl)}`
        : ROUTES.FORGOT_PASSWORD;

    return (
        <>
            <Title level={3} style={{ margin: "0px" }}>
                Login
            </Title>
            <UsernamePasswordForm onSubmit={onSubmitLogin} disabled={loading} />
            <Flex gap="5px">
                <Text>Forgot</Text>
                <Link disabled={loading} href={forgotPasswordUrl}>
                    Username / Password ?
                </Link>
            </Flex>
        </>
    );
};

export default LoginPage;
