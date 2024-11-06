import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Confirm = ({ show, onConfirm, onCancel, message }) => {
    return (
        <Modal show={show} onHide={onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>{message || '정말 이 작업을 수행하시겠습니까?'}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
            <Button variant="secondary" onClick={onCancel}>취소</Button>
            <Button variant="danger" onClick={onConfirm}>확인</Button>
        </Modal.Footer>
        </Modal>
    );
};

export default Confirm;
