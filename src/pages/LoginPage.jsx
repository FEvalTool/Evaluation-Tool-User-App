import { useNavigate } from "react-router";
import { Flex, Typography, message } from "antd";

import { login } from "../services/authServices";
import UsernamePasswordForm from "../components/forms/UsernamePasswordForm";

const { Text, Title, Link } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();

    const onSubmitLogin = async (values) => {
        await login(values);
        navigate("/test-main");
    };

    return (
        <>
            <Title level={3} style={{ margin: "0px" }}>
                Login
            </Title>
            <UsernamePasswordForm onSubmit={onSubmitLogin} />
            <Flex gap="5px">
                <Text>Forgot</Text>
                <Link href="/forgot-password">Username / Password ?</Link>
            </Flex>
        </>
    );
};
export default LoginPage;
