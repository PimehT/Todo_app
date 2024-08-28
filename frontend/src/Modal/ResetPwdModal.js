import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../Context/authContext';
import { ModalContext } from '../Context/modalContext';
import './Modal.scss';

const ResetPwdModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { doPasswordUpdate, userLoggedIn } = useAuth();
  const { hideModal } = useContext(ModalContext);
  const [formState, setFormState] = useState({
    formData: {
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
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const checkPasswordRequirements = (password) => ({
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    digit: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

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

  const validateFormData = () => {
    const { password, confirmPassword } = formState.formData;
    const errors = {};

    const reqs = checkPasswordRequirements(password);
    if (!reqs.length) errors.password = 'Password must be at least 8 characters long';
    if (!reqs.lowercase) errors.password = 'Password must contain at least one lowercase letter';
    if (!reqs.uppercase) errors.password = 'Password must contain at least one uppercase letter';
    if (!reqs.digit) errors.password = 'Password must contain at least one digit';
    if (!reqs.specialChar) errors.password = 'Password must contain at least one special character';
    
    if (!password) errors.password = 'Password is required';
    if (!confirmPassword) errors.confirmPassword = 'Confirm password is required';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setFormState((prevState) => ({ ...prevState, formErrors: errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateFormData()) {
      setLoadingIcon(true);
      const { password } = formState.formData;
      
      // Extract the `oobCode` from the URL
      const queryParams = new URLSearchParams(location.search);
      const oobCode = queryParams.get('oobCode');

      if (!oobCode) {
        setErrorMessage('Invalid or missing reset code.');
        setLoadingIcon(false);
        return;
      }

      try {
        // Call doPasswordUpdate with the oobCode and new password
        await doPasswordUpdate(oobCode, password);
        hideModal();
        userLoggedIn ? navigate('/tasks') : navigate('/');
      } catch (error) {
        console.error('Reset Password Error:', error.message);
        setErrorMessage('Failed to reset password. Please try again.');
      } finally {
        setLoadingIcon(false);
      }
    }
  };

  const onClose = () => {
    userLoggedIn ? navigate('/tasks') : navigate('/');
  }

  const { formData, formErrors, passwordRequirements } = formState;

  return (
    <div className='modalZone'>
      <div className='modalContainer'>
        <div className='modalHeader'>
          <h2>Reset Your Password</h2>
          <button className='closeModalBtn' onClick={onClose}>&times;</button>
        </div>
        <div className='modalBody'>
          <form onSubmit={handleSubmit}>
            {['password', 'confirmPassword'].map((field, index) => (
              <div key={index} className='formGroup'>
                <label className='required' htmlFor={field}>
                  {field === 'password' ? 'Password' : 'Confirm Password'}
                </label>
                <div className='inputGroup'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id={field}
                    name={field}
                    placeholder={'********'}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {formErrors[field] && <p className='formError'>{formErrors[field]}</p>}
                {errorMessage && <p className='formError'>{errorMessage}</p>}
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
                <button style={{ width: '100%' }} type='submit' className='saveModalBtn' disabled={loadingIcon}>
                  {loadingIcon ? <ClipLoader color='#fff' loading={loadingIcon} size={15} /> : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPwdModal;
