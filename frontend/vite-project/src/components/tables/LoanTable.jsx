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

  return (
    <div style={{ marginTop: 24 }}>
      <input
        type="text"
        placeholder="Buscar por usuario o libro"
        value={search}
        onChange={handleSearchChange}
        style={{ width: '100%', padding: 8, marginBottom: 16, borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }}
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={thStyle}>Usuario</th>
              <th style={thStyle}>Libro</th>
              <th style={thStyle}>Fecha de Préstamo</th>
              <th style={thStyle}>Fecha de Devolución</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLoans.map((loan) => (
              <tr key={loan.id}>
                <td style={tdStyle}>{loan.user?.name}</td>
                <td style={tdStyle}>{loan.book?.title}</td>
                <td style={tdStyle}>{loan.borrow_date || loan.borrowDate}</td>
                <td style={tdStyle}>{loan.return_date || loan.returnDate || "Pendiente"}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => onEdit(loan)}
                      style={{ padding: '4px 12px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(loan.id)}
                      style={{ padding: '4px 12px', background: '#fff', color: '#d32f2f', border: '1px solid #d32f2f', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
        <span style={{ fontSize: 15 }}>
          Mostrando {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, filteredLoans.length)} de {filteredLoans.length}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #ccc', background: '#eee', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
          >
            Anterior
          </button>
          <span style={{ fontSize: 15 }}>Página {page + 1}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * rowsPerPage >= filteredLoans.length}
            style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #ccc', background: '#eee', cursor: (page + 1) * rowsPerPage >= filteredLoans.length ? 'not-allowed' : 'pointer' }}
          >
            Siguiente
          </button>
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', fontSize: 15 }}
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

const thStyle = { padding: 10, borderBottom: '2px solid #eee', textAlign: 'left' };
const tdStyle = { padding: 10, borderBottom: '1px solid #eee' };

export default LoanTable;
