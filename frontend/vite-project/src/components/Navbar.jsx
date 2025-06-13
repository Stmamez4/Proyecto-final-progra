import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
    setUserRole(localStorage.getItem('role'));
    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
      setUserRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold fs-5">Biblioteca</span>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center gap-1">
            {isAuthenticated && (
              <li className="nav-item">
                <Link to="/books" className="nav-link">Libros</Link>
              </li>
            )}
            {isAuthenticated && (userRole === 'Gestor' || userRole === 'Administrador') && (
              <li className="nav-item">
                <Link to="/books/new" className="nav-link">Agregar Libro</Link>
              </li>
            )}
            {isAuthenticated && (userRole === 'Gestor' || userRole === 'Administrador') && (
              <li className="nav-item">
                <Link to="/users" className="nav-link">Usuarios</Link>
              </li>
            )}
            {isAuthenticated && (userRole === 'Gestor' || userRole === 'Administrador') && (
              <li className="nav-item">
                <Link to="/reportes" className="nav-link">Reportes</Link>
              </li>
            )}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Registrarse</Link>
                </li>
              </>
            )}
            {/* Mostrar solo si SÍ está autenticado */}
            {isAuthenticated && (
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-outline-light ms-2 fw-bold px-3 py-1">
                  Cerrar Sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
