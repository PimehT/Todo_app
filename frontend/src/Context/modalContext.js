import React, { createContext, useState } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isModalOpen: false,
    modalType: null, // 'login' or 'register'
  });

  const showModal = (type) => {
    setModalState({
      isModalOpen: true,
      modalType: type,
    });
  };

  const hideModal = () => {
    setModalState({
      isModalOpen: false,
      modalType: null,
    });
  };

  const switchToLogin = () => {
    hideModal();
    showModal('login');
  };

  const switchToRegister = () => {
    hideModal();
    showModal('register');
  };

  return (
    <ModalContext.Provider value={{ modalState, showModal, hideModal, switchToLogin, switchToRegister }}>
      {children}
    </ModalContext.Provider>
  );
};
