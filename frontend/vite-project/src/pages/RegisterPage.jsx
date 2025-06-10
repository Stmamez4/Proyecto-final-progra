import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h4" textAlign="center" mb={3}>Registrar Cuenta</Typography>
      <TextField
        fullWidth
        label="Nombre"
        {...register("nombre")}
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Apellido"
        {...register("apellido")}
        error={!!errors.apellido}
        helperText={errors.apellido?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Correo Electrónico"
        {...register("correo")}
        error={!!errors.correo}
        helperText={errors.correo?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Contraseña"
        type="password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Número de Identificación"
        {...register("numero_identificacion")}
        error={!!errors.numero_identificacion}
        helperText={errors.numero_identificacion?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Rol (ID)"
        type="number"
        {...register("rol_id")}
        error={!!errors.rol_id}
        helperText={errors.rol_id?.message}
        margin="normal"
      />
      <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>Registrar</Button>
    </Box>
  );
};

export default RegisterPage;
