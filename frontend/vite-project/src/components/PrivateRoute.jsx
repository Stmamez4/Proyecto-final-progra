import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ maxWidth: 600, marginTop: 60 }}>
        <div className="bg-white rounded shadow p-4 w-100 text-center">
          <h2>Acceso denegado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }
  return <Outlet />;
};

export default PrivateRoute;
