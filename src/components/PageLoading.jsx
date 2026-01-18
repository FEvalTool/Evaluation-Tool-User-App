import { Spin, Flex, Typography } from "antd";

const { Text } = Typography;

const PageLoading = () => (
    <Flex vertical align="center" justify="center" style={{ height: "100vh" }}>
        <Spin size="large" />
        <Text style={{ marginTop: 16 }} type="secondary" strong>
            Loading Page...
        </Text>
    </Flex>
);

export default PageLoading;
