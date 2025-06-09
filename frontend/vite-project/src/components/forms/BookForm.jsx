import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const BookForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    author: initialData.author || "",
    publisher: initialData.publisher || "",
    year: initialData.year || "",
    isbn: initialData.isbn || "",
    quantity: initialData.quantity || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "El título es obligatorio.";
    if (!formData.author) newErrors.author = "El autor es obligatorio.";
    if (!formData.isbn) newErrors.isbn = "El ISBN es obligatorio.";
    if (formData.quantity < 0) newErrors.quantity = "La cantidad no puede ser negativa.";
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
      <Typography variant="h5">{initialData.id ? "Editar Libro" : "Agregar Libro"}</Typography>

      <TextField
        label="Título"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={!!errors.title}
        helperText={errors.title}
        fullWidth
      />

      <TextField
        label="Autor"
        name="author"
        value={formData.author}
        onChange={handleChange}
        error={!!errors.author}
        helperText={errors.author}
        fullWidth
      />

      <TextField
        label="Editorial"
        name="publisher"
        value={formData.publisher}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Año de Publicación"
        name="year"
        value={formData.year}
        onChange={handleChange}
        type="number"
        fullWidth
      />

      <TextField
        label="ISBN"
        name="isbn"
        value={formData.isbn}
        onChange={handleChange}
        error={!!errors.isbn}
        helperText={errors.isbn}
        fullWidth
      />

      <TextField
        label="Cantidad Disponible"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        type="number"
        error={!!errors.quantity}
        helperText={errors.quantity}
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary">
        {initialData.id ? "Guardar Cambios" : "Agregar Libro"}
      </Button>
    </Box>
  );
};

export default BookForm;
