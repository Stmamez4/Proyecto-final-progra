import React, { useState } from "react";

const UserTable = ({ users, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const userRole = localStorage.getItem("role");

  const canEditDelete = userRole === "Gestor" || userRole === "Administrador";

  return (
    <>
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o correo"
        value={search}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 16,
          borderRadius: 4,
          border: "1px solid #ccc",
          fontSize: 16,
        }}
      />
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px #0001",
          }}
        >
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Apellido</th>
              <th style={thStyle}>Correo</th>
              <th style={thStyle}>Teléfono</th>
              <th style={thStyle}>Identificación</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>{user.firstName}</td>
                <td style={tdStyle}>{user.lastName}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.phone}</td>
                <td style={tdStyle}>{user.idNumber}</td>
                <td style={tdStyle}>
                  {canEditDelete && (
                    <>
                      <button
                        onClick={() => onEdit(user)}
                        style={{
                          padding: "4px 12px",
                          background: "#1976d2",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontSize: 14,
                          marginRight: 6,
                        }}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(user.id)}
                        style={{
                          padding: "4px 12px",
                          background: "#fff",
                          color: "#d32f2f",
                          border: "1px solid #d32f2f",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontSize: 14,
                        }}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <span style={{ fontSize: 15 }}>
          Mostrando {page * rowsPerPage + 1} -{" "}
          {Math.min((page + 1) * rowsPerPage, filteredUsers.length)} de{" "}
          {filteredUsers.length}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: "#eee",
              cursor: page === 0 ? "not-allowed" : "pointer",
            }}
          >
            Anterior
          </button>
          <span style={{ fontSize: 15 }}>Página {page + 1}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: "#eee",
              cursor:
                (page + 1) * rowsPerPage >= filteredUsers.length
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Siguiente
          </button>
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: "#fff",
              fontSize: 15,
            }}
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} por página
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

const thStyle = {
  padding: 10,
  borderBottom: "2px solid #eee",
  textAlign: "left",
};
const tdStyle = {
  padding: 10,
  borderBottom: "1px solid #eee",
};

export default UserTable;
