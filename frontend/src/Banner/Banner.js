import React, { useContext } from 'react';
import bannerImg380 from '../assets/todo-banner_b3gai0_c_scale,w_380.png';
import bannerImg588 from '../assets/todo-banner_b3gai0_c_scale,w_588.png';
import bannerImg865 from '../assets/todo-banner_b3gai0_c_scale,w_865.png';
import LoginModal from '../Modal/LoginModal';
import RegisterModal from '../Modal/RegisterModal';
import { ModalContext } from '../Context/modalContext';
import './Banner.scss';


const Banner = () => {
  const { modalState, showModal, hideModal, switchToLogin, switchToRegister } = useContext(ModalContext);

  return (
    <section className='Banner container'>
      <div className='banner-image'>
        <img
          sizes="(max-width: 2163px) 40vw, 865px"
          srcSet={`
            ${bannerImg380} 380w,
            ${bannerImg588} 588w,
            ${bannerImg865} 865w
          `}
          src={bannerImg865}
          loading="lazy"
          alt="todo banner"
          className='banner-img'
        />
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
