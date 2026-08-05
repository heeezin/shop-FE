import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Alert = ({ show, onClose, onDontShowAgain, message }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>※마감 임박</Modal.Title>
            </Modal.Header>
            <Modal.Body dangerouslySetInnerHTML={{ __html: message }} />
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>닫기</Button>
                <Button className='bg-black' onClick={onDontShowAgain}>다시 보지 않기</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Alert;
