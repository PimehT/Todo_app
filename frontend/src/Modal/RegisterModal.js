import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../Context/authContext';
import ResponseModal from './ResponseModal';
import { ClipLoader } from 'react-spinners';
import './Modal.scss';

const RegisterModal = ({ hideModal, switchToLogin }) => {
  const navigate = useNavigate();
  const { signup, doResendEmailVerification, loginWithGoogle } = useAuth();
  const [formState, setFormState] = useState({
    formData: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    formErrors: {},
    passwordRequirements: {
      length: false,
      lowercase: false,
      uppercase: false,
      digit: false,
      specialChar: false,
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);

  const handleResendVerification = async () => {
    setLoadingIcon(true);
    const response = await doResendEmailVerification();
    setResendMessage(response);
    setLoadingIcon(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => {
      const updatedFormData = {
        ...prevState.formData,
        [name]: value
      };

      const updatedPasswordRequirements = 
        name === 'password' ? checkPasswordRequirements(value) : prevState.passwordRequirements;

      return {
        ...prevState,
        formData: updatedFormData,
        passwordRequirements: updatedPasswordRequirements,
      };
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const checkPasswordRequirements = (password) => ({
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    digit: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

  const validateFormData = () => {
    const { firstName, lastName, email, password, confirmPassword } = formState.formData;
    const errors = {};

    if (!firstName) errors.firstName = 'First Name is required';
    if (!lastName) errors.lastName = 'Last Name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    else {
      const reqs = checkPasswordRequirements(password);
      if (!reqs.length) errors.password = 'Password must be at least 8 characters long';
      if (!reqs.lowercase) errors.password = 'Password must contain at least one lowercase letter';
      if (!reqs.uppercase) errors.password = 'Password must contain at least one uppercase letter';
      if (!reqs.digit) errors.password = 'Password must contain at least one digit';
      if (!reqs.specialChar) errors.password = 'Password must contain at least one special character';
    }
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setFormState((prevState) => ({ ...prevState, formErrors: errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoadingIcon(true);
    if (validateFormData()) {
      console.log('Form Data Submitted:', formState.formData);
      const { email, password, firstName, lastName } = formState.formData;
      try {
        await signup(email, password, firstName, lastName);
        console.log('User registered successfully');
        setResponseMessage("A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account.");
        setShowResponseModal(true);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('The email address is already in use by another account.');
        } else {
          setErrorMessage('Error registering user: ' + error.message);
        }
        setLoadingIcon(false);
        console.log('Error registering user:', errorMessage);
      } finally {
        setLoadingIcon(false);
      }
    }
  };

  const handleGoogleSignUp = async (e) => {
    // sign up logic here
    hideModal();
    try {
      const { token, user } = await loginWithGoogle();
      navigate('/tasks');
      console.log('user registered through google provider');
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

  const onClose = () => {
    setShowResponseModal(false);
    hideModal();
  };

  const { formData, formErrors, passwordRequirements } = formState;

  return (
    <div className='modalZone'>
      {showResponseModal ? (
        <ResponseModal 
          title={'Verification Email Sent'}
          message={responseMessage}
          onResend={handleResendVerification}
          resendMessage={resendMessage}
          onClose={onClose}
        />
      ) : (
        <div className='modalContainer'>
        <div className='modalHeader'>
          <h2>Register Your Profile</h2>
          <button className='closeModalBtn' onClick={() => hideModal(false)}>&times;</button>
        </div>
        <div className='modalBody'>
          <form onSubmit={handleSubmit}>
            {['firstName', 'lastName', 'email', 'password', 'confirmPassword'].map((field, index) => (
              <div key={index} className='formGroup'>
                <label className='required' htmlFor={field}>
                  {field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className='inputGroup'>
                  <input
                    type={field.endsWith('assword') && !showPassword ? 'password' : field === 'email' ? 'email' : 'text'}
                    id={field}
                    name={field}
                    placeholder={field === 'confirmPassword' || field === 'password' ? '********' : field === 'email' ? 'example@email.com' : 'John'}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                  {field.endsWith('assword') && (<button
                    type="button"
                    className="toggle-password-btn"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>)}
                </div>
                {formErrors[field] && <p className='formError'>{formErrors[field]}</p>}
                {errorMessage && field === 'email' && <p className='formError'>{errorMessage}</p>}
              </div>
            ))}
            {formData.password && (
              <ul className='passwordRequirements'>
                <li style={{ color: passwordRequirements.length ? 'green' : 'red' }}>At least 8 characters</li>
                <li style={{ color: passwordRequirements.lowercase ? 'green' : 'red' }}>At least one lowercase letter</li>
                <li style={{ color: passwordRequirements.uppercase ? 'green' : 'red' }}>At least one uppercase letter</li>
                <li style={{ color: passwordRequirements.digit ? 'green' : 'red' }}>At least one digit</li>
                <li style={{ color: passwordRequirements.specialChar ? 'green' : 'red' }}>At least one special character</li>
              </ul>
            )}
            <div className='modalFooter'>
              <div className='Btn'>
                <button type='button' className='closeModalBtn' onClick={() => hideModal(false)}>Close</button>
                <button type='submit' className='saveModalBtn' disabled={loadingIcon}>
                  {loadingIcon ? <ClipLoader color='white' size={15} /> : 'Register'}
                </button>
              </div>
              <div className='footerText'>
                <p>Already have an account? <button onClick={switchToLogin}>Login</button></p>
                <p>SignUp with <button onClick={handleGoogleSignUp}>Google</button></p>
              </div>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};

export default RegisterModal;
