import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

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
      navigate("/books");
    } catch (error) {
      alert("Error al iniciar sesión: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Iniciar Sesión</h2>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Correo Electrónico</label>
        <input
          type="email"
          {...register("email")}
          style={{ width: '100%', padding: 8, border: errors.email ? '1px solid #d32f2f' : '1px solid #ccc', borderRadius: 4 }}
        />
        {errors.email && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.email.message}</span>}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Contraseña</label>
        <input
          type="password"
          {...register("password")}
          style={{ width: '100%', padding: 8, border: errors.password ? '1px solid #d32f2f' : '1px solid #ccc', borderRadius: 4 }}
        />
        {errors.password && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.password.message}</span>}
      </div>
      <button type="submit" style={{ width: '100%', padding: '10px 0', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>
        Iniciar Sesión
      </button>
    </form>
  );
};

export default LoginPage;
