import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import apiClient from "../../api/apiClient";

const BookTable = ({ onEdit }) => {
  const [books, setBooks] = useState([]);

  // Fetch de libros
  const fetchBooks = async () => {
    try {
      const response = await apiClient.get("/books");
      setBooks(response.data);
    } catch (error) {
      alert("Error al cargar los libros: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  // Eliminar libro
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este libro?")) return;
    try {
      await apiClient.delete(`/books/${id}`);
      fetchBooks(); // Recargar la lista después de eliminar
    } catch (error) {
      alert("Error al eliminar el libro: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Autor</TableCell>
            <TableCell>ISBN</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{book.quantity}</TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onEdit(book)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(book.id)}
                  >
                    Eliminar
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookTable;