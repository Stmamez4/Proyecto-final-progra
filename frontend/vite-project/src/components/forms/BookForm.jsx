
import { TextField, Button, Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  title: yup.string().required("El título es obligatorio."),
  author: yup.string().required("El autor es obligatorio."),
  publisher: yup.string(),
  year: yup
    .number()
    .typeError("El año debe ser un número")
    .integer("El año debe ser un número entero")
    .min(0, "El año no puede ser negativo")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  isbn: yup.string().required("El ISBN es obligatorio."),
  quantity: yup
    .number()
    .typeError("La cantidad debe ser un número")
    .min(0, "La cantidad no puede ser negativa")
    .required("La cantidad es obligatoria"),
});

const BookForm = ({ onSubmit, initialData = {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialData.title || "",
      author: initialData.author || "",
      publisher: initialData.publisher || "",
      year: initialData.year || "",
      isbn: initialData.isbn || "",
      quantity: initialData.quantity || "",
    },
  });


  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, margin: "auto", display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5">{initialData.id ? "Editar Libro" : "Agregar Libro"}</Typography>

      <TextField
        label="Título"
        {...register("title")}
        error={!!errors.title}
        helperText={errors.title}
        fullWidth
      />

      <TextField
        label="Autor"
        {...register("author")}
        error={!!errors.author}
        helperText={errors.author}
        fullWidth
      />

      <TextField
        label="Editorial"
        {...register("publisher")}
        error={!!errors.publisher}
        helperText={errors.publisher?.message}
        fullWidth
      />

      <TextField
        label="Año de Publicación"
        {...register("year")}
        type="number"
        error={!!errors.year}
        helperText={errors.year?.message}
        fullWidth
      />

      <TextField
        label="ISBN"
        {...register("isbn")}
        error={!!errors.isbn}
        helperText={errors.isbn?.message}
        fullWidth
      />

      <TextField
         label="Cantidad Disponible"
        {...register("quantity")}
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
