import React from 'react';
import './Modal.scss';

const ResponseModal = ({ title, message, onResend, onConfirm, onClose, resendMessage }) => {
  return (
    <div className="modalZone">
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
