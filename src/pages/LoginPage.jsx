import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Flex, Typography } from "antd";

import { login } from "../slices/authSlice";
import UsernamePasswordForm from "../components/forms/UsernamePasswordForm";
import ROUTES from "../constants/routes";

const { Text, Title, Link } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const onSubmitLogin = async (values) => {
        const resultAction = await dispatch(login(values));

        if (login.fulfilled.match(resultAction)) {
            const user = resultAction.payload.user;

            if (user.first_time_setup) {
                navigate(ROUTES.SETUP_ACCOUNT, { replace: true });
            } else {
                const from = location.state?.from?.pathname || ROUTES.TEST_MAIN;
                navigate(from, { replace: true });
            }
        }
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
