import { useNavigate } from "react-router-dom";
import { Flex, Typography } from "antd";

import { login } from "../services/authServices";
import UsernamePasswordForm from "../components/forms/UsernamePasswordForm";
import ROUTES from "../constants/routes";

const { Text, Title, Link } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();

    const onSubmitLogin = async (values) => {
        await login(values);
        navigate(ROUTES.TEST_MAIN);
    };

    return (
        <>
            <Title level={3} style={{ margin: "0px" }}>
                Login
            </Title>
            <UsernamePasswordForm onSubmit={onSubmitLogin} />
            <Flex gap="5px">
                <Text>Forgot</Text>
                <Link href={ROUTES.FORGOT_PASSWORD}>Username / Password ?</Link>
            </Flex>
        </>
    );
};
export default LoginPage;
