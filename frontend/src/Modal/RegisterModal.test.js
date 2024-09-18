import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterModal from './RegisterModal';
import { useAuth } from '../Context/authContext';

jest.mock('../Context/authContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('RegisterModal', () => {
  const mockHideModal = jest.fn();
  const mockSwitchToLogin = jest.fn();
  const mockSignup = jest.fn();
  const mockDoResendEmailVerification = jest.fn();
  const mockLoginWithGoogle = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      signup: mockSignup,
      doResendEmailVerification: mockDoResendEmailVerification,
      loginWithGoogle: mockLoginWithGoogle,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders RegisterModal component', () => {
    render(<RegisterModal hideModal={mockHideModal} switchToLogin={mockSwitchToLogin} />);
    expect(screen.getByText('Register Your Profile')).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(<RegisterModal hideModal={mockHideModal} switchToLogin={mockSwitchToLogin} />);
    const firstNameInput = screen.getByLabelText('FirstName');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput.value).toBe('John');
  });

  test('validates form data and shows errors', async () => {
    render(<RegisterModal hideModal={mockHideModal} switchToLogin={mockSwitchToLogin} />);
    const submitButton = screen.getByText('Register');
    fireEvent.click(submitButton);
    const errorMessages = ['First Name is required', 'Last Name is required', 'Email is required', 'Password is required'];

    await waitFor(() => {
      errorMessages.forEach((message) => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });
  });

  test('submits form with valid data', async () => {
    render(<RegisterModal hideModal={mockHideModal} switchToLogin={mockSwitchToLogin} />);
    fireEvent.change(screen.getByLabelText('FirstName'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('LastName'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Password123!' } });

    const submitButton = screen.getByText('Register');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('john.doe@example.com', 'Password123!', 'John', 'Doe');
    });
  });

  /* test('handles Google sign up', async () => {
    render(<RegisterModal hideModal={mockHideModal} switchToLogin={mockSwitchToLogin} />);
    const googleButton = screen.getByText('SignUp with');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockLoginWithGoogle).toHaveBeenCalled();
    });
  }); */
});
