import React from 'react';
import './Modal.scss';

const ResponseModal = ({ message, onResend, onClose, resendMessage }) => {
  return (
    <div className="modalZone">
      <div className="modalContainer">
        <div className="modalHeader">
          <h2>Verification Email Sent</h2>
          <button className="closeModalBtn" onClick={onClose}>&times;</button>
        </div>
        <div className="modalBody">
          <p>{message}</p>
        </div>
        <div className='modalFooter'>
          <div className='footerText'>
            <p><button onClick={onResend}>Resend Verification Email</button></p>
            {resendMessage && <p>{resendMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
