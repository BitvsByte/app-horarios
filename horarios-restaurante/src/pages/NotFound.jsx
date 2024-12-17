import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl mb-4">404 - Página no encontrada</h1>
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
