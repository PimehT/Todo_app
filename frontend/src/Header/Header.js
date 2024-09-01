import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.scss';
import Logo from '../assets/banner-orange.png';
import ProfileIcon from '../assets/user-solid.svg';
import NotifyIcon from '../assets/bell-solid.svg';
import Search from '../Search/Search';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import { useAuth } from '../Context/authContext';
import { ModalContext } from '../Context/modalContext';

const Header = () => {
  const { userLoggedIn } = useAuth();
  const { switchToLogin } = React.useContext(ModalContext);
  const navigate = useNavigate();

  const notifyClick = () => console.log('Notification icon clicked');

  return (
    <header className='Header'>
      <div className='container'>
        <div className='left-header'>
          <img src={Logo} alt='app logo' className='App-logo' onClick={() => userLoggedIn ? navigate('/tasks') : navigate('/')} />

          {userLoggedIn ? (
            <ProfileDropdown />
          ) : (
            <div className="icon profile-icon" onClick={switchToLogin}>
              <img src={ProfileIcon} alt="profile icon" />
            </div>
          )}
        </div>

        <div className='right-header'>
          <Search />

          <div className='icon notifyBtn' onClick={ userLoggedIn ? notifyClick : switchToLogin} >
            <img src={NotifyIcon} alt='notification icon' />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
