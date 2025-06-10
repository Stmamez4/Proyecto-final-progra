import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import apiClient from "../../api/apiClient";

const schema = yup.object({
  title: yup.string().required("El título es obligatorio."),
  author: yup.string().required("El autor es obligatorio."),
  isbn: yup.string().required("El ISBN es obligatorio."),
  quantity: yup
    .number()
    .typeError("La cantidad debe ser un número")
    .integer("La cantidad debe ser un número entero")
    .min(0, "La cantidad no puede ser negativa")
    .required("La cantidad es obligatoria."),
});

const BookForm = ({ onSuccess, book = {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: book,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      if (book.id) {
        await apiClient.put(`/books/${book.id}`, data);
      } else {
        await apiClient.post("/books", data);
      }
      onSuccess && onSuccess();
    } catch (error) {
      alert("Error al guardar el libro: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  const userRole = localStorage.getItem('role');
  const canSubmit = userRole === 'Gestor' || userRole === 'Administrador';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
      <h3 style={{ textAlign: "center", marginBottom: 24 }}>
        {book.id ? "Editar Libro" : "Nuevo Libro"}
      </h3>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Título</label>
        <input
          type="text"
          {...register("title")}
          style={{
            width: "100%",
            padding: 8,
            border: errors.title ? "1px solid #d32f2f" : "1px solid #ccc",
            borderRadius: 4,
          }}
        />
        {errors.title && (
          <span style={{ color: "#d32f2f", fontSize: 13 }}>
            {errors.title.message}
          </span>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Autor</label>
        <input
          type="text"
          {...register("author")}
          style={{
            width: "100%",
            padding: 8,
            border: errors.author ? "1px solid #d32f2f" : "1px solid #ccc",
            borderRadius: 4,
          }}
        />
        {errors.author && (
          <span style={{ color: "#d32f2f", fontSize: 13 }}>
            {errors.author.message}
          </span>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>ISBN</label>
        <input
          type="text"
          {...register("isbn")}
          style={{
            width: "100%",
            padding: 8,
            border: errors.isbn ? "1px solid #d32f2f" : "1px solid #ccc",
            borderRadius: 4,
          }}
        />
        {errors.isbn && (
          <span style={{ color: "#d32f2f", fontSize: 13 }}>
            {errors.isbn.message}
          </span>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Cantidad</label>
        <input
          type="number"
          {...register("quantity")}
          style={{
            width: "100%",
            padding: 8,
            border: errors.quantity ? "1px solid #d32f2f" : "1px solid #ccc",
            borderRadius: 4,
          }}
        />
        {errors.quantity && (
          <span style={{ color: "#d32f2f", fontSize: 13 }}>
            {errors.quantity.message}
          </span>
        )}
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
      {!canSubmit && <div style={{ color: '#d32f2f', marginTop: 8, textAlign: 'center' }}>No tienes permisos para realizar esta acción.</div>}
    </form>
  );
};

export default BookForm;
