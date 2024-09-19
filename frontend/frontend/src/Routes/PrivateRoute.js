import { useContext } from 'react';
import { ModalContext } from '../Context/modalContext';
import { useAuth } from '../Context/authContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const { showModal } = useContext(ModalContext);

  if (!currentUser) {
    showModal('login');
    return null;
  }

  return children;
};

export default PrivateRoute;
