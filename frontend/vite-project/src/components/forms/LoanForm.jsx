
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";

const LoanForm = ({ onSubmit, initialData = {}, users = [], books = [] }) => {
  const [formData, setFormData] = useState({
    userId: initialData.userId || "",
    bookId: initialData.bookId || "",
    loanDate: initialData.loanDate || new Date().toISOString().split("T")[0],
    returnDate: initialData.returnDate || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = "El usuario es obligatorio.";
    if (!formData.bookId) newErrors.bookId = "El libro es obligatorio.";
    if (!formData.returnDate) {
      newErrors.returnDate = "La fecha de devolución es obligatoria.";
    } else if (new Date(formData.returnDate) <= new Date(formData.loanDate)) {
      newErrors.returnDate = "La fecha de devolución debe ser posterior a la fecha de préstamo.";
    }
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
      <Typography variant="h5">{initialData.id ? "Editar Préstamo" : "Agregar Préstamo"}</Typography>

      <TextField
        select
        label="Usuario"
        name="userId"
        value={formData.userId}
        onChange={handleChange}
        error={!!errors.userId}
        helperText={errors.userId}
        fullWidth
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {`${user.firstName} ${user.lastName}`}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Libro"
        name="bookId"
        value={formData.bookId}
        onChange={handleChange}
        error={!!errors.bookId}
        helperText={errors.bookId}
        fullWidth
      >
        {books.map((book) => (
          <MenuItem key={book.id} value={book.id}>
            {book.title}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Fecha de Préstamo"
        name="loanDate"
        value={formData.loanDate}
        onChange={handleChange}
        type="date"
        fullWidth
        disabled
      />

      <TextField
        label="Fecha de Devolución"
        name="returnDate"
        value={formData.returnDate}
        onChange={handleChange}
        type="date"
        error={!!errors.returnDate}
        helperText={errors.returnDate}
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary">
        {initialData.id ? "Guardar Cambios" : "Agregar Préstamo"}
      </Button>
    </Box>
  );
};

export default LoanForm;
