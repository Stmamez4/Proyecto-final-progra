import React, { useState } from "react";
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

  const userRole = localStorage.getItem('role');
  const canSubmit = userRole === 'Gestor' || userRole === 'Administrador';

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0001",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h3
        style={{
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        {initialData.id ? "Editar Préstamo" : "Nuevo Préstamo"}
      </h3>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Usuario</label>
        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 8,
            border: errors.userId ? "1px solid #d32f2f" : "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || `${user.nombre} ${user.apellido}`}
            </option>
          ))}
        </select>
        {errors.userId && (
          <span style={{ color: "#d32f2f", fontSize: 13 }}>{errors.userId}</span>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Libro</label>
        <select
          name="bookId"
          value={formData.bookId}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 8,
            border: errors.bookId ? "1px solid #d32f2f" : "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          <option value="">Selecciona un libro</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title || book.titulo}
            </option>
          ))}
        </select>
        {errors.bookId && (
          <span style={{ color: "#d32f2f", fontSize: 13 }}>{errors.bookId}</span>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Fecha de Préstamo</label>
        <input
          type="date"
          name="loanDate"
          value={formData.loanDate}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
          disabled={!!initialData.id}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Fecha de Devolución</label>
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px 0",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontWeight: "bold",
          fontSize: 16,
          cursor: canSubmit ? "pointer" : "not-allowed",
          opacity: canSubmit ? 1 : 0.6,
        }}
        disabled={!canSubmit}
      >
        Guardar
      </button>
      {!canSubmit && (
        <div style={{ color: '#d32f2f', marginTop: 8, textAlign: 'center' }}>
          No tienes permisos para realizar esta acción.
        </div>
      )}
      {errors.message && (
        <div
          style={{
            color: "#d32f2f",
            marginTop: 16,
            textAlign: "center",
          }}
        >
          {errors.message}
        </div>
      )}
    </form>
  );
};

export default LoanForm;
