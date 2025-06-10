import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: 32, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', textAlign: 'center' }}>
        <h2>Acceso denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }
  return <Outlet />;
};

export default PrivateRoute;
