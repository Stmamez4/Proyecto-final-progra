import React, { useEffect, useState } from "react";
import UserTable from "../components/tables/UserTable";
import UserForm from "../components/forms/UserForm";
import apiClient from "../api/apiClient";

const mapUserFromApi = (user) => ({
  id: user.id,
  firstName: user.name?.split(" ")[0] || "",
  lastName: user.name?.split(" ").slice(1).join(" ") || "",
  email: user.email,
  role: user.role,
});

const mapUserToApi = (user) => ({
  name: `${user.firstName} ${user.lastName}`.trim(),
  email: user.email,
  role: user.role || "user",
});

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/users");
      setUsers(response.data.map(mapUserFromApi));
    } catch (err) {
      setError("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    setOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await apiClient.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Error al eliminar usuario");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingUser) {
        await apiClient.put(`/users/${editingUser.id}`, mapUserToApi(formData));
      } else {
        await apiClient.post("/users", mapUserToApi(formData));
      }
      setOpen(false);
      fetchUsers();
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar usuario");
    }
  };

  const userRole = localStorage.getItem('role');
  if (userRole !== 'Gestor' && userRole !== 'Administrador') {
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ maxWidth: 600, marginTop: 60 }}>
        <div className="bg-white rounded shadow p-4 w-100 text-center">
          <h2>Acceso denegado</h2>
          <p>No tienes permisos para ver la gestión de usuarios.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 900, marginTop: 40 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Usuarios</h2>
        <button
          onClick={handleAdd}
          className="btn btn-primary fw-bold"
        >
          Agregar Usuario
        </button>
      </div>
      {error && (
        <div className="alert alert-danger mb-3">{error}</div>
      )}
      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      {open && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: '#0008' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 position-relative">
              <button type="button" className="btn-close position-absolute end-0 top-0 m-3" aria-label="Cerrar" onClick={() => setOpen(false)}></button>
              <h3 className="mb-3">{editingUser ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
              <UserForm
                initialData={editingUser || {}}
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
