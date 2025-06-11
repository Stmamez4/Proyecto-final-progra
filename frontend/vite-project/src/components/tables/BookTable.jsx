import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";

const BookTable = ({ onEdit }) => {
  const [books, setBooks] = useState([]);
  const userRole = localStorage.getItem('role');
  const canEditDelete = userRole === 'Gestor' || userRole === 'Administrador';

  const fetchBooks = async () => {
    try {
      const response = await apiClient.get("/books");
      setBooks(response.data);
    } catch (error) {
      alert("Error al cargar los libros: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este libro?")) return;
    try {
      await apiClient.delete(`/books/${id}`);
      fetchBooks();
    } catch (error) {
      alert("Error al eliminar el libro: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="mt-4 table-responsive">
      <table className="table table-bordered table-striped align-middle">
        <thead className="table-light">
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>ISBN</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.isbn}</td>
              <td>{book.quantity}</td>
              <td>
                {canEditDelete && (
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => onEdit(book)}
                      className="btn btn-primary btn-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;