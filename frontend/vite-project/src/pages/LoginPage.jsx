import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h4" textAlign="center" mb={3}>Iniciar Sesión</Typography>
      <TextField
        fullWidth
        label="Correo Electrónico"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
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
      <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>Iniciar Sesión</Button>
    </Box>
  );
};

export default LoginPage;
