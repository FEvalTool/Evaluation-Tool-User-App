import PropTypes from "prop-types";
import Icon from "@ant-design/icons";

import LogoSvg from "../assets/icons/logo_fpt.svg?react";

export const LogoIcon = ({ size }) => (
    <Icon
        component={() => <LogoSvg style={{ width: size, height: "auto" }} />}
    />
);

LogoIcon.propTypes = {
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};
