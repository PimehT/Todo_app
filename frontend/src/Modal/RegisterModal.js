import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Modal.scss';

const RegisterModal = ({ hideModal, switchToLogin }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFormData()) {
      console.log('Form Data Submitted:', formState.formData);
      hideModal();
    }
  };

  const handleGoogleSignUp = (e) => {
    // sign up logic here
  }

  const { formData, formErrors, passwordRequirements } = formState;

  return (
    <div className='modalZone'>
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
                <button type='submit' className='saveModalBtn'>Register</button>
              </div>
              <div className='footerText'>
                <p>Already have an account? <button onClick={switchToLogin}>Login</button></p>
                <p>SignUp with <button onClick={handleGoogleSignUp}>Google</button></p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
