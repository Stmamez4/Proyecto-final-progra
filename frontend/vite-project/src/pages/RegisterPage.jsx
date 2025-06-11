import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import apiClient from "../api/apiClient";
import { useEffect, useState } from "react";

const schema = yup.object({
  nombre: yup.string().required("El nombre es obligatorio"),
  apellido: yup.string().required("El apellido es obligatorio"),
  correo: yup.string().email("Debe ser un correo válido").required("El correo es obligatorio"),
  password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
  numero_identificacion: yup.string().required("El número de identificación es obligatorio"),
  rol_id: yup.number().typeError("El rol es obligatorio").required("El rol es obligatorio"),
});

const RegisterPage = () => {
  const [roles, setRoles] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    apiClient.get("/roles").then(res => {
      setRoles(res.data);
    }).catch(() => {
      setRoles([]);
    });
  }, []);

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
    <div className="container" style={{ maxWidth: 400, marginTop: 40 }}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white rounded shadow">
        <h2 className="text-center mb-4">Registrar Cuenta</h2>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            {...register("nombre")}
            className={`form-control${errors.nombre ? " is-invalid" : ""}`}
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input
            type="text"
            {...register("apellido")}
            className={`form-control${errors.apellido ? " is-invalid" : ""}`}
          />
          {errors.apellido && <div className="invalid-feedback">{errors.apellido.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            {...register("correo")}
            className={`form-control${errors.correo ? " is-invalid" : ""}`}
          />
          {errors.correo && <div className="invalid-feedback">{errors.correo.message}</div>}
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
        <div className="mb-3">
          <label className="form-label">Número de Identificación</label>
          <input
            type="text"
            {...register("numero_identificacion")}
            className={`form-control${errors.numero_identificacion ? " is-invalid" : ""}`}
          />
          {errors.numero_identificacion && <div className="invalid-feedback">{errors.numero_identificacion.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select
            {...register("rol_id")}
            className={`form-select${errors.rol_id ? " is-invalid" : ""}`}
            defaultValue=""
          >
            <option value="" disabled>Selecciona un rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>{rol.name}</option>
            ))}
          </select>
          {errors.rol_id && <div className="invalid-feedback">{errors.rol_id.message}</div>}
        </div>
        <button type="submit" className="btn btn-primary w-100 fw-bold fs-5">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
