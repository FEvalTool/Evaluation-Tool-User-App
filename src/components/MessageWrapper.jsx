import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { message } from "antd";

import { clearMessage } from "../slices/messageSlice";

const MessageWrapper = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const { type, content, key } = useSelector((state) => state.message);

    useEffect(() => {
        if (content) {
            messageApi.open({ type, content });
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

MessageWrapper.propTypes = {
    children: PropTypes.node,
};

export default MessageWrapper;
