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
      <div style={{ maxWidth: 600, margin: '60px auto', padding: 32, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', textAlign: 'center' }}>
        <h2>Acceso denegado</h2>
        <p>No tienes permisos para ver la gestión de usuarios.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Usuarios</h2>
        <button
          onClick={handleAdd}
          style={{ padding: '8px 20px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Agregar Usuario
        </button>
      </div>
      {error && (
        <div style={{ color: '#d32f2f', marginBottom: 16 }}>{error}</div>
      )}
      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      {open && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 32, minWidth: 350, maxWidth: 400, boxShadow: '0 2px 16px #0003', position: 'relative' }}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 8, right: 8, background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>×</button>
            <h3 style={{ marginTop: 0 }}>{editingUser ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
            <UserForm
              initialData={editingUser || {}}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
