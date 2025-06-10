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
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16, padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
      <h3 style={{ textAlign: 'center', marginBottom: 16 }}>{initialData.id ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Nombre</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, border: errors.firstName ? '1px solid #d32f2f' : '1px solid #ccc', borderRadius: 4 }}
        />
        {errors.firstName && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.firstName}</span>}
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Apellido</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, border: errors.lastName ? '1px solid #d32f2f' : '1px solid #ccc', borderRadius: 4 }}
        />
        {errors.lastName && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.lastName}</span>}
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, border: errors.email ? '1px solid #d32f2f' : '1px solid #ccc', borderRadius: 4 }}
        />
        {errors.email && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.email}</span>}
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Teléfono</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Número de Identificación</label>
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, border: errors.idNumber ? '1px solid #d32f2f' : '1px solid #ccc', borderRadius: 4 }}
        />
        {errors.idNumber && <span style={{ color: '#d32f2f', fontSize: 13 }}>{errors.idNumber}</span>}
      </div>
      <button type="submit" style={{ width: '100%', padding: '10px 0', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold', fontSize: 16, cursor: canSubmit ? 'pointer' : 'not-allowed', opacity: canSubmit ? 1 : 0.6 }} disabled={!canSubmit}>
        {initialData.id ? 'Guardar Cambios' : 'Agregar Usuario'}
      </button>
      {!canSubmit && <div style={{ color: '#d32f2f', marginTop: 8, textAlign: 'center' }}>No tienes permisos para realizar esta acción.</div>}
    </form>
  );
};

export default UserForm;
