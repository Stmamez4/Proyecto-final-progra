import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const UserForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    idNumber: initialData.idNumber || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "El nombre es obligatorio.";
    if (!formData.lastName) newErrors.lastName = "El apellido es obligatorio.";
    if (!formData.email) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)) {
      newErrors.email = "El correo no tiene un formato válido.";
    }
    if (!formData.idNumber) newErrors.idNumber = "El número de identificación es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, margin: "auto", display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5">{initialData.id ? "Editar Usuario" : "Agregar Usuario"}</Typography>

      <TextField
        label="Nombre"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        error={!!errors.firstName}
        helperText={errors.firstName}
        fullWidth
      />

      <TextField
        label="Apellido"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        error={!!errors.lastName}
        helperText={errors.lastName}
        fullWidth
      />

      <TextField
        label="Correo Electrónico"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
      />

      <TextField
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Número de Identificación"
        name="idNumber"
        value={formData.idNumber}
        onChange={handleChange}
        error={!!errors.idNumber}
        helperText={errors.idNumber}
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary">
        {initialData.id ? "Guardar Cambios" : "Agregar Usuario"}
      </Button>
    </Box>
  );
};

export default UserForm;
