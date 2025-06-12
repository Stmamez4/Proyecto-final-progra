import BookTable from "../components/tables/BookTable";
import { useNavigate } from "react-router-dom";

function BookListPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const canAdd = userRole === 'Gestor' || userRole === 'Administrador';

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column bg-light p-0" style={{minHeight: '100vh'}}>
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-start w-100" style={{paddingTop: 40}}>
        <div className="w-100" style={{maxWidth: 1400}}>
          <h2 className="mb-4">Lista de Libros</h2>
          {canAdd && (
            <button
              onClick={() => navigate("/books/new")}
              className="btn btn-primary fw-bold mb-3"
            >
              Agregar Libro
            </button>
          )}
          <BookTable />
        </div>
      </div>
    </div>
  );
}

export default BookListPage;