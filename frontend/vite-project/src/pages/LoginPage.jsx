import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const schema = yup.object({
  email: yup.string().email("Debe ser un correo válido").required("El correo es obligatorio"),
  password: yup.string().required("La contraseña es obligatoria"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await apiClient.post("/auth/login", data);
      localStorage.setItem("token", response.data.token);
      const decoded = jwtDecode(response.data.token);
      const userRole = decoded.role || (decoded.sub && decoded.sub.role) || (decoded.identity && decoded.identity.role);
      if (userRole) {
        localStorage.setItem("role", userRole);
      }
      navigate("/books");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert("Error al iniciar sesión: " + error.response.data.error);
      } else if (error.message) {
        alert("Error al iniciar sesión: " + error.message);
      } else {
        alert("Error al iniciar sesión: error desconocido");
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: 40 }}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white rounded shadow">
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            {...register("email")}
            className={`form-control${errors.email ? " is-invalid" : ""}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            {...register("password")}
            className={`form-control${errors.password ? " is-invalid" : ""}`}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>
        <button type="submit" className="btn btn-primary w-100 fw-bold fs-5">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
