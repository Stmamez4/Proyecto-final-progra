import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";
import apiClient from "../../api/apiClient";

const schema = yup.object({
  title: yup.string().required("El título es obligatorio."),
  author: yup.string().required("El autor es obligatorio."),
  isbn: yup.string().required("El ISBN es obligatorio."),
  quantity: yup
    .number()
    .typeError("La cantidad debe ser un número")
    .integer("La cantidad debe ser un número entero")
    .min(0, "La cantidad no puede ser negativa")
    .required("La cantidad es obligatoria."),
});

const BookForm = ({ onSuccess, book = {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: book,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      if (book.id) {
        await apiClient.put(`/books/${book.id}`, data);
      } else {
        await apiClient.post("/books", data);
      }
      onSuccess && onSuccess();
    } catch (error) {
      alert("Error al guardar el libro: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 400, mx: "auto", mt: 5 }}
    >
      <Typography variant="h5" textAlign="center" mb={3}>
        {book.id ? "Editar Libro" : "Nuevo Libro"}
      </Typography>
      <TextField
        fullWidth
        label="Título"
        {...register("title")}
        error={!!errors.title}
        helperText={errors.title?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Autor"
        {...register("author")}
        error={!!errors.author}
        helperText={errors.author?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        label="ISBN"
        {...register("isbn")}
        error={!!errors.isbn}
        helperText={errors.isbn?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Cantidad"
        type="number"
        {...register("quantity")}
        error={!!errors.quantity}
        helperText={errors.quantity?.message}
        margin="normal"
      />
      <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>
        Guardar
      </Button>
    </Box>
  );
};

export default BookForm;
