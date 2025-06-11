import BookForm from "../components/forms/BookForm";
import apiClient from "../api/apiClient";

function AddBookPage({ navigateToList }) {
  const userRole = localStorage.getItem('role');
  if (userRole !== 'Gestor' && userRole !== 'Administrador') {
    return (
      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ maxWidth: 600, marginTop: 60 }}>
        <div className="bg-white rounded shadow p-4 w-100 text-center">
          <h2>Acceso denegado</h2>
          <p>No tienes permisos para agregar libros.</p>
        </div>
      </div>
    );
  }

  const handleAddBook = async (data) => {
    try {
      await apiClient.post("/books", data);
      alert("Libro creado exitosamente");
      if (navigateToList) navigateToList();
    } catch (error) {
      alert("Error al crear el libro");
      console.error(error);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 500, marginTop: 40 }}>
      <h1 className="mb-4">Agregar Libro</h1>
      <BookForm onSubmit={handleAddBook} />
      <button
        onClick={navigateToList}
        className="btn btn-outline-secondary mt-3 fw-bold"
      >
        Volver a la lista
      </button>
    </div>
  );
}

export default AddBookPage;