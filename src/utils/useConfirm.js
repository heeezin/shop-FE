import { useState } from "react";

const useConfirm = () => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [onConfirmCallback, setOnConfirmCallback] = useState(() => {});

    const openConfirm = (callback, msg = '이 작업을 수행하시겠습니까?') => {
        setOnConfirmCallback(() => callback);
        setMessage(msg);
        setShow(true);
    };

    const closeConfirm = () => {
        setShow(false);
    };

    const handleConfirm = () => {
        if (onConfirmCallback) {
        onConfirmCallback();
        }
        closeConfirm();
    };

    return {
        show,
        message,
        openConfirm,
        closeConfirm,
        handleConfirm,
    };
};

export default useConfirm;
