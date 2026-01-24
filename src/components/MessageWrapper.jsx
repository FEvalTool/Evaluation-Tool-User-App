import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { notification } from "antd";

import { clearMessage } from "../slices/messageSlice";

const NotificationDescription = ({ type, error, code }) => {
    if (type == "success") {
        return <></>;
    }
    return (
        <div>
            {error.length ? (
                error.map((err) => (
                    <div>
                        {err.field} : {err.message}
                    </div>
                ))
            ) : (
                <></>
            )}
            <div style={{ marginTop: 8, opacity: 0.7 }}>Error code: {code}</div>
        </div>
    );
};

const NotificationWrapper = ({ children }) => {
    const [notificationApi, contextHolder] = notification.useNotification();
    const dispatch = useDispatch();
    const { type, message, error, code, key } = useSelector(
        (state) => state.message,
    );

    useEffect(() => {
        if (message) {
            notificationApi.open({
                type,
                message,
                description: (
                    <NotificationDescription
                        type={type}
                        error={error}
                        code={code}
                    />
                ),
                placement: "topRight",
            });
            dispatch(clearMessage());
        }
    }, [key]);

    return (
        <>
            {contextHolder}
            {children}
        </>
    );
};

NotificationWrapper.propTypes = {
    children: PropTypes.node,
};

export default NotificationWrapper;
