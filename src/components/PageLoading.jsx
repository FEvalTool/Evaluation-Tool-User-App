import { Spin } from "antd";

const PageLoading = () => (
    <div
        style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <Spin size="large" tip="Loading Page..." />
    </div>
);

export default PageLoading;
