import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../Context/authContext';
import './Modal.scss';

const LoginModal = ({ hideModal, switchToRegister }) => {
  const { loginWithEmail } = useAuth();
  const [formState, setFormState] = useState({
    formData: {
      email: '',
      password: '',
    },
    formErrors: {},
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFormData()) {
      console.log('Form Data Submitted:', formState.formData);
      try {
        const { email, password } = formState.formData;
        const success = loginWithEmail(email, password);
        console.log('Login Successful');
        console.log('Success:', success);
        hideModal();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleGoogleLogin = (e) => {
    // google login logic
  }

  const { formData, formErrors } = formState;

  return (
    <div className='modalZone'>
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
                    value={formData[field]}
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
                {formErrors[field] && <p className='formError'>{formErrors[field]}</p>}
              </div>
            ))}
            <div className='modalFooter'>
              <div className='Btn'>
                <button type='button' className='closeModalBtn' onClick={hideModal}>Close</button>
                <button type='submit' className='saveModalBtn'>Login</button>
              </div>
              <div className='footerText'>
                <p>Don't have an account? <button onClick={switchToRegister}>Sign Up</button></p>
                <p>Login with <button onClick={handleGoogleLogin}>Google</button></p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
