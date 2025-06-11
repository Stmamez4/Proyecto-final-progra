import BookTable from "../components/tables/BookTable";
import { useNavigate } from "react-router-dom";

function BookListPage() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ maxWidth: 1000, marginTop: 40 }}>
      <h2 className="mb-4">Lista de Libros</h2>
      <button
        onClick={() => navigate("/books/new")}
        className="btn btn-primary fw-bold mb-3"
      >
        Agregar Libro
      </button>
      <BookTable />
    </div>
  );
}

export default BookListPage;