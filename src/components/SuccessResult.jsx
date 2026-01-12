import { Result } from "antd";
import PropTypes from "prop-types";

const SuccessResult = ({ title, subTitle }) => (
    <Result status="success" title={title} subTitle={subTitle} />
);

SuccessResult.PropTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
};

export default SuccessResult;
