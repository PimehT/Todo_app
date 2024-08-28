import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../Context/authContext';
import ResponseModal from './ResponseModal';
import './Modal.scss';

const LoginModal = ({ hideModal, switchToRegister }) => {
  const navigate = useNavigate();
  const {
    loginWithEmail, doResendEmailVerification,
    loginWithGoogle, resetPassword
  } = useAuth();
  const [formState, setFormState] = useState({
    formData: {
      password: '',
      confirmPassword: '',
    },
    formErrors: {},
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    field: '',
    message: '',
  });
  const [resendMessage, setResendMessage] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => {
      const updatedFormData = {
        ...prevState.formData,
        [name]: value
      };

      return {
        ...prevState,
        formData: updatedFormData,
      };
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateFormData = () => {
    const { email, password } = formState.formData;
    const errors = {};

    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';

    setFormState((prevState) => ({ ...prevState, formErrors: errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFormData()) {
      console.log('Form Data Submitted:', formState.formData);
      setLoadingIcon(true);
      try {
        const { email, password } = formState.formData;
        const userCredential = await loginWithEmail(email, password);
        console.log('Login Successful');
        console.log('User Credentials:', userCredential.user.emailVerified);
        hideModal();
        navigate('/tasks');
      } catch (error) {
        console.error('Login Error:', error.message);
        if (error.message.includes('Email not verified')) {
          setShowResponseModal(true);
          setErrorMessage({
            field: '',
            message: error.message,
          })
        } else {
          setErrorMessage({
            field: error.message.includes('email') ? 'email' : 'password',
            message: error.message,
          });
        }
      } finally {
        setLoadingIcon(false);
      }
    }
  };

  const handleGoogleLogin = async (e) => {
    // google login logic
    hideModal();
    try {
      const { user, token } = await loginWithGoogle();
      navigate('/tasks')
      console.log('user logged in through google provider');
      console.log('User:', user);
      console.log('Token:', token);
    } catch(error) {
      console.log('Google Sign-In Error:', error.message);
      setFormState((prevState) => ({
        ...prevState,
        formErrors: { ...prevState.formErrors, login: error.message },
      }));
    }
  }

  const handleResendVerification = async () => {
    setLoadingIcon(true);
    const response = await doResendEmailVerification();
    setResendMessage(response);
    setLoadingIcon(false);
  };

  const handleResetPassword = async () => {
    setErrorMessage({ field: '', message: '' });
    const { email } = formState.formData;
    if (!email) {
      setErrorMessage({
        field: 'email',
        message: 'Email is required to reset password',
      });
      return;
    }
    setLoadingIcon(true);
    try {
      const response = await resetPassword(email);
      console.log(response);
      hideModal();
    } catch (error) {
      console.error('Login Error:', error.message);
      setErrorMessage({field: 'email', message: error.message});
    } finally {
      setLoadingIcon(false);
    }
  }

  const onClose = () => {
    setShowResponseModal(false);
    hideModal();
  };

  const { formData, formErrors } = formState;

  return (
    <div className='modalZone'>
      {showResponseModal ? (
        <ResponseModal 
          message={errorMessage.message}
          onResend={handleResendVerification}
          resendMessage={resendMessage}
          onClose={onClose}
        />
      ) : (
        <div className='modalContainer'>
          <div className='modalHeader'>
            <h2>Welcome Back</h2>
            <button className='closeModalBtn' onClick={hideModal}>&times;</button>
          </div>
          <div className='modalBody'>
            <form onSubmit={handleSubmit}>
              {['email', 'password'].map((field, index) => (
                <div key={index} className='formGroup'>
                  <label className='required' htmlFor={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className='inputGroup'>
                    <input
                      type={field.includes('password') && !showPassword ? 'password' : 'text'}
                      id={field}
                      name={field}
                      placeholder={field === 'password' ? '********' : 'example@email.com'}
                      value={formData[field] || ''}
                      onChange={handleChange}
                    />
                    {field.includes('password') && (
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    )}
                  </div>
                  { errorMessage.message
                    && !errorMessage.message.includes('reset')
                    && formErrors[field]
                    && <p className='formError'>{formErrors[field]}</p>}
                  {errorMessage.field === field && <p className='formError'>{errorMessage.message}</p>}
                </div>
              ))}
              <div className='modalFooter'>
                <div className='Btn'>
                  <button type='button' className='closeModalBtn' onClick={hideModal}>Close</button>
                  <button type='submit' className='saveModalBtn' disabled={loadingIcon}>
                    {loadingIcon ? <ClipLoader color='#fff' loading={loadingIcon} size={15} /> : 'Login'}
                  </button>
                </div>
                <div className='footerText'>
                  <p>Don't have an account? <button onClick={switchToRegister}>Sign Up</button></p>
                  <p>Login with <button onClick={handleGoogleLogin}>Google</button></p>
                  <p style={{ paddingTop: '5px'}}>Forgot your password? <button onClick={handleResetPassword}>Reset</button></p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModal;
