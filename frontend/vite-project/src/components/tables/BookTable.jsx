import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";

const BookTable = ({ onEdit }) => {
  const [books, setBooks] = useState([]);

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
    <div style={{ marginTop: 32, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={thStyle}>Título</th>
            <th style={thStyle}>Autor</th>
            <th style={thStyle}>ISBN</th>
            <th style={thStyle}>Cantidad</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td style={tdStyle}>{book.title}</td>
              <td style={tdStyle}>{book.author}</td>
              <td style={tdStyle}>{book.isbn}</td>
              <td style={tdStyle}>{book.quantity}</td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onEdit(book)}
                    style={{ padding: '4px 12px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    style={{ padding: '4px 12px', background: '#fff', color: '#d32f2f', border: '1px solid #d32f2f', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = { padding: 10, borderBottom: '2px solid #eee', textAlign: 'left' };
const tdStyle = { padding: 10, borderBottom: '1px solid #eee' };

export default BookTable;