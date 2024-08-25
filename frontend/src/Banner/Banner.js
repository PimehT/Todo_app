import React, { useContext } from 'react';
import bannerImg from '../assets/todo-banner.png';
import LoginModal from '../Modal/LoginModal';
import RegisterModal from '../Modal/RegisterModal';
import { ModalContext } from '../Context/modalContext';
import './Banner.scss';

const Banner = () => {
  const { modalState, showModal, hideModal, switchToLogin, switchToRegister } = useContext(ModalContext);

  return (
    <section className='Banner container'>
      <div className='banner-image'>
        <img src={bannerImg} alt='todo banner 1' className='banner-img' />
      </div>
      <div className='banner-text'>
        <h2>Seize the Day, One Task at a Time</h2>
        <div className='banner-btns'>
          <button className='btn primaryBtn'
            onClick={() => showModal('register')}
          >
            Get Started
          </button>
          <button className='btn secondaryBtn'
            onClick={() => showModal('login')}
          >
            Login
          </button>
          {modalState.isModalOpen && modalState.modalType === 'login' && (
            <LoginModal hideModal={hideModal} switchToRegister={switchToRegister} />
          )}
          {modalState.isModalOpen && modalState.modalType === 'register' && (
            <RegisterModal hideModal={hideModal} switchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Banner;
