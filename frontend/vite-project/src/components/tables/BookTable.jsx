import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box
} from "@mui/material";
import apiClient from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

const BookTable = ({ books, onEdit, onDelete }) => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await apiClient.get("/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error obteniendo libros:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);
    const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este libro?")) {
      try {
        await apiClient.delete(`/books/${id}`);
        setBooks((prev) => prev.filter((book) => book.id !== id));
      } catch (error) {
        alert("Error eliminando libro");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/books/edit/${id}`);
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", mt: 4 }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/books/new")}
      >
       Agregar Libro
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(book.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => handleDelete(book.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default BookTable;