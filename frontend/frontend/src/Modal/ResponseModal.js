import React, { useEffect, useRef, useState } from 'react';
import './Modal.scss';

const ResponseModal = ({ title, message, onResend, onConfirm, onClose, resendMessage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const responseModalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (responseModalRef.current && !responseModalRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div className="modalZone" ref={responseModalRef}>
      <div className="modalContainer">
        <div className="modalHeader">
          <h2>{title}</h2>
          <button className="closeModalBtn" onClick={onClose}>&times;</button>
        </div>
        <div className="modalBody">
          <p>{message}</p>
        </div>
        <div className='modalFooter'>
          { onResend && (
            <div className='footerText'>
              <p><button onClick={onResend}>Resend Verification Email</button></p>
              {resendMessage && <p>{resendMessage}</p>}
            </div>
          )}
          { onConfirm && (
            <div className='Btn'>
              <button type='button' className='saveModalBtn' onClick={onClose}>Cancel</button>
              <button type='submit' className='closeModalBtn delete' onClick={onConfirm}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
