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
      className="p-4 bg-white rounded shadow"
      style={{ maxWidth: 400, margin: '40px auto' }}
    >
      <h3 className="text-center mb-4">{initialData.id ? "Editar Préstamo" : "Nuevo Préstamo"}</h3>
      <div className="mb-3">
        <label className="form-label">Usuario</label>
        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className={`form-select${errors.userId ? ' is-invalid' : ''}`}
        >
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || `${user.nombre} ${user.apellido}`}
            </option>
          ))}
        </select>
        {errors.userId && (
          <div className="invalid-feedback">{errors.userId}</div>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label">Libro</label>
        <select
          name="bookId"
          value={formData.bookId}
          onChange={handleChange}
          className={`form-select${errors.bookId ? ' is-invalid' : ''}`}
        >
          <option value="">Selecciona un libro</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title || book.titulo}
            </option>
          ))}
        </select>
        {errors.bookId && (
          <div className="invalid-feedback">{errors.bookId}</div>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label">Fecha de Préstamo</label>
        <input
          type="date"
          name="loanDate"
          value={formData.loanDate}
          onChange={handleChange}
          className="form-control"
          disabled={!!initialData.id}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Fecha de Devolución</label>
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100 fw-bold fs-5"
        disabled={!canSubmit}
      >
        Guardar
      </button>
      {!canSubmit && (
        <div className="text-danger mt-2 text-center">
          No tienes permisos para realizar esta acción.
        </div>
      )}
      {errors.message && (
        <div className="text-danger mt-3 text-center">
          {errors.message}
        </div>
      )}
    </form>
  );
};

export default LoanForm;
