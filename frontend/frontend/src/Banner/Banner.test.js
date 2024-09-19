import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalProvider } from '../Context/modalContext'; // Adjust the import path
import Banner from './Banner';

jest.mock('../assets/todo-banner_b3gai0_c_scale,w_380.png', () => 'bannerImg380');
jest.mock('../assets/todo-banner_b3gai0_c_scale,w_588.png', () => 'bannerImg588');
jest.mock('../assets/todo-banner_b3gai0_c_scale,w_865.png', () => 'bannerImg865');

describe('Banner component', () => {
  const MockModalProvider = ({ children }) => (
    <ModalProvider value={{
      modalState: { isModalOpen: false, modalType: null },
      showModal: jest.fn(),
      hideModal: jest.fn(),
      switchToLogin: jest.fn(),
      switchToRegister: jest.fn()
    }}>
      {children}
    </ModalProvider>
  );

  beforeEach(() => {
    render(
      <MockModalProvider>
        <Banner />
      </MockModalProvider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the banner structure', () => {
    expect(screen.getByTestId('banner-container')).toBeInTheDocument();
    expect(screen.getByTestId('banner-image')).toBeInTheDocument();
    expect(screen.getByTestId('banner-text')).toBeInTheDocument();
  });

  it('loads the correct image', () => {
    const img = screen.getByAltText('todo banner');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('srcset', expect.stringContaining('bannerImg380'));
    expect(img).toHaveAttribute('src', 'bannerImg865');
  });

  it('renders buttons', () => {
    const getStartedBtn = screen.getByRole('button', { name: /Get Started/i });
    const loginBtn = screen.getByRole('button', { name: /Login/i });
    expect(getStartedBtn).toBeInTheDocument();
    expect(loginBtn).toBeInTheDocument();
  });

  it('opens register modal when Get Started button is clicked', () => {
    const getStartedBtn = screen.getByRole('button', { name: /Get Started/i });
    fireEvent.click(getStartedBtn);
    expect(MockModalProvider.value.showModal).toHaveBeenCalledWith('register');
  });

  it('opens login modal when Login button is clicked', () => {
    const loginBtn = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginBtn);
    expect(MockModalProvider.value.showModal).toHaveBeenCalledWith('login');
  });

  it('renders LoginModal when modal type is login', async () => {
    MockModalProvider.value.modalState.isModalOpen = true;
    MockModalProvider.value.modalState.modalType = 'login';
    render(
      <MockModalProvider>
        <Banner />
      </MockModalProvider>
    );

    await screen.findByTestId('login-modal');
    expect(screen.getByTestId('login-modal')).toBeInTheDocument();
  });

  it('renders RegisterModal when modal type is register', async () => {
    MockModalProvider.value.modalState.isModalOpen = true;
    MockModalProvider.value.modalState.modalType = 'register';
    render(
      <MockModalProvider>
        <Banner />
      </MockModalProvider>
    );

    await screen.findByTestId('register-modal');
    expect(screen.getByTestId('register-modal')).toBeInTheDocument();
  });

  it('passes correct props to LoginModal', async () => {
    MockModalProvider.value.modalState.isModalOpen = true;
    MockModalProvider.value.modalState.modalType = 'login';
    render(
      <MockModalProvider>
        <Banner />
      </MockModalProvider>
    );

    await screen.findByTestId('login-modal');
    expect(MockModalProvider.value.hideModal).toHaveBeenCalled();
    expect(MockModalProvider.value.switchToRegister).toHaveBeenCalled();
  });

  it('passes correct props to RegisterModal', async () => {
    MockModalProvider.value.modalState.isModalOpen = true;
    MockModalProvider.value.modalState.modalType = 'register';
    render(
      <MockModalProvider>
        <Banner />
      </MockModalProvider>
    );

    await screen.findByTestId('register-modal');
    expect(MockModalProvider.value.hideModal).toHaveBeenCalled();
    expect(MockModalProvider.value.switchToLogin).toHaveBeenCalled();
  });
});
