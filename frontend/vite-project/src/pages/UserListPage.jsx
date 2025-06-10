import React, { useEffect, useState } from "react";
import UserTable from "../components/tables/UserTable";
import UserForm from "../components/forms/UserForm";
import apiClient from "../api/apiClient";
import { Button, Dialog, DialogContent, DialogTitle, Box, Typography } from "@mui/material";

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

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Usuarios</Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Agregar Usuario
        </Button>
      </Box>
      {error && (
        <Typography color="error" mb={2}>{error}</Typography>
      )}
      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingUser ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
        <DialogContent>
          <UserForm
            initialData={editingUser || {}}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserListPage;
