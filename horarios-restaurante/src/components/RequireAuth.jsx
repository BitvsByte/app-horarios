import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};

export default RequireAuth;


