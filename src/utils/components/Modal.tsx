import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-md shadow-md w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    {title && <h2 className="text-xl">{title}</h2>}
                    <button onClick={onClose} className="text-xl">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
};

export default Modal;