import BookTable from "../components/tables/BookTable";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";

function BookListPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Libros
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/books/new")}
        sx={{ mb: 2 }}
      >
        Agregar Libro
      </Button>
      <BookTable />
    </Box>
  );
}

export default BookListPage;