import PropTypes from "prop-types";
import Icon from "@ant-design/icons";

import BrandLogoSvg from "../assets/icons/brand_logo.svg?react";
import AppLogoSvg from "../assets/icons/app_logo.svg?react";
import PasswordSvg from "../assets/icons/password.svg?react";
import SecurityQuestionSvg from "../assets/icons/security-question.svg?react";

export const BrandLogo = ({ size, fill }) => (
    <Icon
        component={() => (
            <BrandLogoSvg style={{ width: size, height: "auto", fill: fill }} />
        )}
    />
);

export const AppLogo = ({ size, fill }) => (
    <Icon
        component={() => (
            <AppLogoSvg style={{ width: size, height: "auto", fill: fill }} />
        )}
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

const IconProps = {
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    fill: PropTypes.string.isRequired,
};

BrandLogo.propTypes = IconProps;
AppLogo.propTypes = IconProps;
PasswordIcon.propTypes = IconProps;
SecurityQuestionIcon.propTypes = IconProps;
