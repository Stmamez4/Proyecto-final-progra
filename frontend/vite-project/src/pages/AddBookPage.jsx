import BookForm from "../components/forms/BookForm";
import apiClient from "../../api/apiClient";
import { Button, Box } from "@mui/material";

function AddBookPage({ navigateToList }) {
  const handleAddBook = async (data) => {
    try {
      await apiClient.post("/books", data);
      alert("Libro creado exitosamente");
      if (navigateToList) navigateToList();
    } catch (error) {
      alert("Error al crear el libro");
      console.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 4 }}>
      <h1>Agregar Libro</h1>
      <BookForm onSubmit={handleAddBook} />
      <Button
        variant="outlined"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={navigateToList}
      >
        Volver a la lista
      </Button>
    </Box>
  );
}

export default AddBookPage;