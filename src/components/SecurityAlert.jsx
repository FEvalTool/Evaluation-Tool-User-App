import PropTypes from "prop-types";
import { Alert, Statistic, Typography } from "antd";
const { Timer } = Statistic;
const { Text } = Typography;

const SecurityAlert = ({ exp }) => {
    return (
        <Alert
            message={
                <>
                    <Text>Security Session:</Text>{" "}
                    <Timer
                        type="countdown"
                        value={exp}
                        style={{ display: "inline-block" }}
                        valueStyle={{ fontSize: "14px" }}
                    />{" "}
                    <Text>
                        remaining. To protect your account, this session is
                        time-limited.
                    </Text>
                </>
            }
            type="warning"
            closable
        />
    );
};

SecurityAlert.propTypes = {
    exp: PropTypes.number.isRequired,
};

export default SecurityAlert;
