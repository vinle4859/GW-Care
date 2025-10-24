
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  className?: string;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, className = '', showCloseButton = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className={`bg-white/10 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 w-full max-w-md mx-auto p-6 relative animate-fade-in text-shade-1 ${className}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-shade-1">{title}</h2>
          {showCloseButton && (
            <button onClick={onClose} className="text-shade-2 hover:text-shade-1 text-3xl">&times;</button>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;