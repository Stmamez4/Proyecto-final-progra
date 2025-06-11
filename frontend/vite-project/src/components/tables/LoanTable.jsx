import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";

const LoanTable = ({ onEdit }) => {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchLoans = async () => {
    try {
      const response = await apiClient.get("/loans");
      setLoans(response.data);
    } catch (error) {
      alert("Error al cargar los préstamos: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) return;
    try {
      await apiClient.delete(`/loans/${id}`);
      fetchLoans();
    } catch (error) {
      alert("Error al eliminar el préstamo: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const filteredLoans = loans.filter((loan) => {
    const userName = loan.user?.name || "";
    const bookTitle = loan.book?.title || "";
    return (
      userName.toLowerCase().includes(search.toLowerCase()) ||
      bookTitle.toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginatedLoans = filteredLoans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const userRole = localStorage.getItem('role');
  const canEditDelete = userRole === 'Gestor' || userRole === 'Administrador';

  return (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Buscar por usuario o libro"
        value={search}
        onChange={handleSearchChange}
        className="form-control mb-3"
      />
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Usuario</th>
              <th>Libro</th>
              <th>Fecha de Préstamo</th>
              <th>Fecha de Devolución</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLoans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.user?.name}</td>
                <td>{loan.book?.title}</td>
                <td>{loan.borrow_date || loan.borrowDate}</td>
                <td>{loan.return_date || loan.returnDate || "Pendiente"}</td>
                <td>
                  {canEditDelete && (
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => onEdit(loan)}
                        className="btn btn-primary btn-sm"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(loan.id)}
                        className="btn btn-outline-danger btn-sm"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex align-items-center justify-content-between mt-3">
        <span className="fs-6">
          Mostrando {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, filteredLoans.length)} de {filteredLoans.length}
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
            disabled={(page + 1) * rowsPerPage >= filteredLoans.length}
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
              <option key={n} value={n}>{n} por página</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LoanTable;
