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
      className="p-4 bg-white rounded shadow"
      style={{ maxWidth: 400, margin: '40px auto' }}
    >
      <h3 className="text-center mb-4">{book.id ? "Editar Libro" : "Nuevo Libro"}</h3>
      <div className="mb-3">
        <label className="form-label">Título</label>
        <input
          type="text"
          {...register("title")}
          className={`form-control${errors.title ? ' is-invalid' : ''}`}
        />
        {errors.title && (
          <div className="invalid-feedback">{errors.title.message}</div>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label">Autor</label>
        <input
          type="text"
          {...register("author")}
          className={`form-control${errors.author ? ' is-invalid' : ''}`}
        />
        {errors.author && (
          <div className="invalid-feedback">{errors.author.message}</div>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label">ISBN</label>
        <input
          type="text"
          {...register("isbn")}
          className={`form-control${errors.isbn ? ' is-invalid' : ''}`}
        />
        {errors.isbn && (
          <div className="invalid-feedback">{errors.isbn.message}</div>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label">Cantidad</label>
        <input
          type="number"
          {...register("quantity")}
          className={`form-control${errors.quantity ? ' is-invalid' : ''}`}
        />
        {errors.quantity && (
          <div className="invalid-feedback">{errors.quantity.message}</div>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100 fw-bold fs-5"
        disabled={!canSubmit}
      >
        Guardar
      </button>
      {!canSubmit && <div className="text-danger mt-2 text-center">No tienes permisos para realizar esta acción.</div>}
    </form>
  );
};

export default BookForm;
