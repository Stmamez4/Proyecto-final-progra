import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/reports';

const ReportingPage = () => {
  const [reportType, setReportType] = useState('book');
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (userRole !== 'Administrador') {
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ maxWidth: 600, marginTop: 60 }}>
        <div className="bg-white rounded shadow p-4 w-100 text-center">
          <h2>Acceso denegado</h2>
          <p>Solo los administradores pueden ver los reportes.</p>
        </div>
      </div>
    );
  }

  const handleReportTypeChange = (type) => {
    setReportType(type);
    setFilters({});
    setResults([]);
    setError('');
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    try {
      let url = '';
      let params = {};
      if (reportType === 'book') {
        url = `${API_BASE}/loans-by-book`;
        if (filters.isbn) params.isbn = filters.isbn;
        if (filters.title) params.title = filters.title;
      } else {
        url = `${API_BASE}/loans-by-user`;
        if (filters.user_id) params.user_id = filters.user_id;
        if (filters.email) params.email = filters.email;
      }
      const response = await axios.get(url, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Error al obtener el reporte. ¿Tienes permisos de administrador?'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderFilters = () => {
    if (reportType === 'book') {
      return (
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <input
              type="text"
              name="isbn"
              placeholder="ISBN"
              value={filters.isbn || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              name="title"
              placeholder="Título"
              value={filters.title || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <input
              type="text"
              name="user_id"
              placeholder="ID de Usuario"
              value={filters.user_id || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              name="email"
              placeholder="Correo Electrónico"
              value={filters.email || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>
      );
    }
  };

  const renderTable = () => {
    if (results.length === 0) return <p>No hay resultados.</p>;
    if (reportType === 'book') {
      return (
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>ID Libro</th>
                <th>Título</th>
                <th>ISBN</th>
                <th>ID Préstamo</th>
                <th>ID Usuario</th>
                <th>Fecha Préstamo</th>
                <th>Fecha Devolución</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) =>
                row.loans.length === 0 ? (
                  <tr key={row.book.id + '-empty'}>
                    <td>{row.book.id}</td>
                    <td>{row.book.title}</td>
                    <td>{row.book.isbn}</td>
                    <td colSpan={4} className="text-center">
                      Sin préstamos
                    </td>
                  </tr>
                ) : (
                  row.loans.map((loan) => (
                    <tr key={loan.id}>
                      <td>{row.book.id}</td>
                      <td>{row.book.title}</td>
                      <td>{row.book.isbn}</td>
                      <td>{loan.id}</td>
                      <td>{loan.user_id}</td>
                      <td>{loan.borrow_date}</td>
                      <td>{loan.return_date || 'No devuelto'}</td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>ID Usuario</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>ID Préstamo</th>
                <th>ID Libro</th>
                <th>Fecha Préstamo</th>
                <th>Fecha Devolución</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) =>
                row.loans.length === 0 ? (
                  <tr key={row.user.id + '-empty'}>
                    <td>{row.user.id}</td>
                    <td>{row.user.name}</td>
                    <td>{row.user.email}</td>
                    <td colSpan={4} className="text-center">
                      Sin préstamos
                    </td>
                  </tr>
                ) : (
                  row.loans.map((loan) => (
                    <tr key={loan.id}>
                      <td>{row.user.id}</td>
                      <td>{row.user.name}</td>
                      <td>{row.user.email}</td>
                      <td>{loan.id}</td>
                      <td>{loan.book_id}</td>
                      <td>{loan.borrow_date}</td>
                      <td>{loan.return_date || 'No devuelto'}</td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900, marginTop: 40 }}>
      <h2 className="mb-4">Reportes</h2>
      <div className="btn-group mb-3" role="group">
        <button
          onClick={() => handleReportTypeChange('book')}
          className={`btn ${reportType === 'book' ? 'btn-primary' : 'btn-outline-primary'}`}
        >
          Historial de Libros
        </button>
        <button
          onClick={() => handleReportTypeChange('user')}
          className={`btn ${reportType === 'user' ? 'btn-primary' : 'btn-outline-primary'}`}
        >
          Préstamos por Usuario
        </button>
      </div>
      {renderFilters()}
      <button onClick={fetchReport} className="btn btn-success mb-3 fw-bold">
        Filtrar
      </button>
      {loading && <div className="mb-2">Cargando...</div>}
      {error && <div className="alert alert-danger mb-2">{error}</div>}
      {renderTable()}
    </div>
  );
};

export default ReportingPage;