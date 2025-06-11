import React, { useState } from 'react';

const UserForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    idNumber: initialData.idNumber || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "El nombre es obligatorio.";
    if (!formData.lastName) newErrors.lastName = "El apellido es obligatorio.";
    if (!formData.email) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)) {
      newErrors.email = "El correo no tiene un formato válido.";
    }
    if (!formData.idNumber) newErrors.idNumber = "El número de identificación es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const userRole = localStorage.getItem('role');
  const canSubmit = userRole === 'Gestor' || userRole === 'Administrador';

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3 className="text-center mb-3">{initialData.id ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={`form-control${errors.firstName ? ' is-invalid' : ''}`}
        />
        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Apellido</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={`form-control${errors.lastName ? ' is-invalid' : ''}`}
        />
        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-control${errors.email ? ' is-invalid' : ''}`}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Teléfono</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Número de Identificación</label>
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          className={`form-control${errors.idNumber ? ' is-invalid' : ''}`}
        />
        {errors.idNumber && <div className="invalid-feedback">{errors.idNumber}</div>}
      </div>
      <button type="submit" className="btn btn-primary w-100 fw-bold fs-5" disabled={!canSubmit}>
        {initialData.id ? 'Guardar Cambios' : 'Agregar Usuario'}
      </button>
      {!canSubmit && <div className="text-danger mt-2 text-center">No tienes permisos para realizar esta acción.</div>}
    </form>
  );
};

export default UserForm;
