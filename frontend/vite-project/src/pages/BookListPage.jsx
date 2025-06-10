import BookTable from "../components/tables/BookTable";
import { useNavigate } from "react-router-dom";

function BookListPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0001",
      }}
    >
      <h2 style={{ marginBottom: 24 }}>Lista de Libros</h2>
      <button
        onClick={() => navigate("/books/new")}
        style={{
          marginBottom: 16,
          padding: "8px 20px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Agregar Libro
      </button>
      <BookTable />
    </div>
  );
}

export default BookListPage;