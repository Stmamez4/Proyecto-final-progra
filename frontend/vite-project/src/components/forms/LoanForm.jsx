import React, { useState } from "react";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import apiClient from "../../api/apiClient";

const LoanForm = ({ onSuccess, initialData = {}, users = [], books = [] }) => {
  const [formData, setFormData] = useState({
    userId: initialData.userId || "",
    bookId: initialData.bookId || "",
    loanDate: initialData.loanDate || new Date().toISOString().split("T")[0],
    returnDate: initialData.returnDate || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData.id) {
        await apiClient.put(`/loans/${initialData.id}`, {
          userId: formData.userId,
          bookId: formData.bookId,
          loanDate: formData.loanDate,
          returnDate: formData.returnDate,
        });
      } else {
        await apiClient.post("/loans", {
          userId: formData.userId,
          bookId: formData.bookId,
          loanDate: formData.loanDate,
          returnDate: formData.returnDate,
        });
      }
      onSuccess();
    } catch (error) {
      setErrors(error.response?.data || { message: "Error desconocido" });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h5" textAlign="center" mb={3}>
        {initialData.id ? "Editar Préstamo" : "Nuevo Préstamo"}
      </Typography>
      <TextField
        fullWidth
        select
        label="Usuario"
        name="userId"
        value={formData.userId}
        onChange={handleChange}
        error={!!errors.userId}
        helperText={errors.userId}
        margin="normal"
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name || `${user.nombre} ${user.apellido}`}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        select
        label="Libro"
        name="bookId"
        value={formData.bookId}
        onChange={handleChange}
        error={!!errors.bookId}
        helperText={errors.bookId}
        margin="normal"
      >
        {books.map((book) => (
          <MenuItem key={book.id} value={book.id}>
            {book.title || book.titulo}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        type="date"
        label="Fecha de Préstamo"
        name="loanDate"
        value={formData.loanDate}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
        disabled={!!initialData.id}
      />
      <TextField
        fullWidth
        type="date"
        label="Fecha de Devolución"
        name="returnDate"
        value={formData.returnDate}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>
        Guardar
      </Button>
      {errors.message && (
        <Typography color="error" mt={2} textAlign="center">
          {errors.message}
        </Typography>
      )}
    </Box>
  );
};

export default LoanForm;
