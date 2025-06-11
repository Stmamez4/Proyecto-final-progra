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
        className="form-control mb-3"
      />
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Identificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.idNumber}</td>
                <td>
                  {canEditDelete && (
                    <>
                      <button
                        onClick={() => onEdit(user)}
                        className="btn btn-primary btn-sm me-1"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(user.id)}
                        className="btn btn-outline-danger btn-sm"
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
      <div className="d-flex align-items-center justify-content-between mt-3">
        <span className="fs-6">
          Mostrando {page * rowsPerPage + 1} -{" "}
          {Math.min((page + 1) * rowsPerPage, filteredUsers.length)} de{" "}
          {filteredUsers.length}
        </span>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="btn btn-outline-secondary btn-sm"
          >
            Anterior
          </button>
          <span className="fs-6">Página {page + 1}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
            className="btn btn-outline-secondary btn-sm"
          >
            Siguiente
          </button>
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="form-select form-select-sm"
            style={{ width: 120 }}
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

export default UserTable;
