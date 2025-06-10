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
      <div style={{ maxWidth: 600, margin: '60px auto', padding: 32, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', textAlign: 'center' }}>
        <h2>Acceso denegado</h2>
        <p>Solo los administradores pueden ver los reportes.</p>
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
        <div style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
          <input
            type="text"
            name="isbn"
            placeholder="ISBN"
            value={filters.isbn || ''}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={filters.title || ''}
            onChange={handleInputChange}
          />
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
          <input
            type="text"
            name="user_id"
            placeholder="ID de Usuario"
            value={filters.user_id || ''}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Correo Electrónico"
            value={filters.email || ''}
            onChange={handleInputChange}
          />
        </div>
      );
    }
  };

  const renderTable = () => {
    if (results.length === 0) return <p>No hay resultados.</p>;
    if (reportType === 'book') {
      return (
        <table border="1" cellPadding="6" style={{ width: '100%', marginTop: 16 }}>
          <thead>
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
                  <td colSpan={4} style={{ textAlign: 'center' }}>
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
      );
    } else {
      return (
        <table border="1" cellPadding="6" style={{ width: '100%', marginTop: 16 }}>
          <thead>
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
                  <td colSpan={4} style={{ textAlign: 'center' }}>
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
      );
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2>Reportes</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
        <button
          onClick={() => handleReportTypeChange('book')}
          style={{ background: reportType === 'book' ? '#1976d2' : '#eee', color: reportType === 'book' ? '#fff' : '#000', padding: '8px 16px', border: 'none', borderRadius: 4 }}
        >
          Historial de Libros
        </button>
        <button
          onClick={() => handleReportTypeChange('user')}
          style={{ background: reportType === 'user' ? '#1976d2' : '#eee', color: reportType === 'user' ? '#fff' : '#000', padding: '8px 16px', border: 'none', borderRadius: 4 }}
        >
          Préstamos por Usuario
        </button>
      </div>
      {renderFilters()}
      <button onClick={fetchReport} style={{ marginBottom: 16, padding: '8px 20px', background: '#43a047', color: '#fff', border: 'none', borderRadius: 4 }}>
        Filtrar
      </button>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {renderTable()}
    </div>
  );
};

export default ReportingPage;