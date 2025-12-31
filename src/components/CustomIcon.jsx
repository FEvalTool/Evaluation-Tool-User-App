import PropTypes from "prop-types";
import Icon from "@ant-design/icons";

import LogoSvg from "../assets/icons/logo_fpt.svg?react";
import PasswordSvg from "../assets/icons/password.svg?react";
import SecurityQuestionSvg from "../assets/icons/security-question.svg?react";

export const LogoIcon = ({ size }) => (
    <Icon
        component={() => <LogoSvg style={{ width: size, height: "auto" }} />}
    />
);

export const PasswordIcon = ({ size, fill }) => (
    <Icon
        component={() => (
            <PasswordSvg style={{ width: size, height: "auto", fill: fill }} />
        )}
    />
);

export const SecurityQuestionIcon = ({ size, fill }) => (
    <Icon
        component={() => (
            <SecurityQuestionSvg
                style={{ width: size, height: "auto", fill: fill }}
            />
        )}
    />
);

LogoIcon.propTypes = {
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};
