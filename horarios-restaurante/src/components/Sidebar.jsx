import { Link } from 'react-router-dom';
import  useAuth  from '../context/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-gray-100 p-4 h-screen">
      <ul>
        {user.role === 'admin' && (
          <>
            <li className="mb-4">
              <Link to="/admin">Dashboard de Administración</Link>
            </li>
          </>
        )}
        {user.role === 'worker' && (
          <li className="mb-4">
            <Link to="/worker">Mi Horario</Link>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
