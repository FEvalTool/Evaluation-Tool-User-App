import { Result } from "antd";

const SuccessResult = ({ title, subTitle }) => (
    <Result status="success" title={title} subTitle={subTitle} />
);

export default SuccessResult;
