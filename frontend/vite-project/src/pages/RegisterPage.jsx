import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import apiClient from "../api/apiClient";

const schema = yup.object({
  nombre: yup.string().required("El nombre es obligatorio"),
  apellido: yup.string().required("El apellido es obligatorio"),
  correo: yup.string().email("Debe ser un correo válido").required("El correo es obligatorio"),
  password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
  numero_identificacion: yup.string().required("El número de identificación es obligatorio"),
  rol_id: yup.number().typeError("El rol es obligatorio").required("El rol es obligatorio"),
});

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await apiClient.post("/auth/register", {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        password: data.password,
        numero_identificacion: data.numero_identificacion,
        rol_id: data.rol_id,
      });
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
    } catch (error) {
      alert("Error al registrarse: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Registrar Cuenta</h2>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Nombre</label>
        <input
          type="text"
          {...register("nombre")}
          style={{ width: '100%', padding: 8, border: errors.nombre ? '1px solid #d32f2f' : '1px solid #ccc', borderRadius: 4 }}
        />
        {errors.nombre && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.nombre.message}</span>}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Apellido</label>
        <input
          type="text"
          {...register("apellido")}
          style={{ width: '100%', padding: 8, border: errors.apellido ? '1px solid #d32f2f' : '1px solid #ccc', borderRadius: 4 }}
        />
        {errors.apellido && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.apellido.message}</span>}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Correo Electrónico</label>
        <input
          type="email"
          {...register("correo")}
          style={{ width: '100%', padding: 8, border: errors.correo ? '1px solid #d32f2f' : '1px solid #ccc', borderRadius: 4 }}
        />
        {errors.correo && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.correo.message}</span>}
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
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Número de Identificación</label>
        <input
          type="text"
          {...register("numero_identificacion")}
          style={{ width: '100%', padding: 8, border: errors.numero_identificacion ? '1px solid #d32f2f' : '1px solid #ccc', borderRadius: 4 }}
        />
        {errors.numero_identificacion && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.numero_identificacion.message}</span>}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Rol (ID)</label>
        <input
          type="number"
          {...register("rol_id")}
          style={{ width: '100%', padding: 8, border: errors.rol_id ? '1px solid #d32f2f' : '1px solid #ccc', borderRadius: 4 }}
        />
        {errors.rol_id && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.rol_id.message}</span>}
      </div>
      <button type="submit" style={{ width: '100%', padding: '10px 0', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>
        Registrar
      </button>
    </form>
  );
};

export default RegisterPage;
