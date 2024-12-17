import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <span className="text-xl font-bold text-white mb-4 sm:mb-0">
          Gestión de Horarios
        </span>
        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-white">
              Hola, {user.name}
            </span>
          )}
          <button 
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;
