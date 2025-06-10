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
    <nav style={{ background: '#343a40', padding: '0.5rem 1rem', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Biblioteca</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/books" style={navLinkStyle}>Libros</Link>
          {isAuthenticated && (userRole === 'Gestor' || userRole === 'Administrador') && (
            <Link to="/books/new" style={navLinkStyle}>Agregar Libro</Link>
          )}
          {isAuthenticated && (userRole === 'Gestor' || userRole === 'Administrador') && (
            <Link to="/users" style={navLinkStyle}>Usuarios</Link>
          )}
          {isAuthenticated && (userRole === 'Gestor' || userRole === 'Administrador') && (
            <Link to="/reportes" style={navLinkStyle}>Reportes</Link>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login" style={navLinkStyle}>Iniciar Sesión</Link>
              <Link to="/register" style={navLinkStyle}>Registrarse</Link>
            </>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} style={{ ...navLinkStyle, background: 'transparent', border: 'none', cursor: 'pointer' }}>
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

const navLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  transition: 'background 0.2s',
  fontSize: '1rem',
};
