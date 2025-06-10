import BookForm from "../components/forms/BookForm";
import apiClient from "../api/apiClient";

function AddBookPage({ navigateToList }) {
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
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0001",
      }}
    >
      <h1>Agregar Libro</h1>
      <BookForm onSubmit={handleAddBook} />
      <button
        onClick={navigateToList}
        style={{
          marginTop: 16,
          padding: "8px 20px",
          background: "#eee",
          color: "#333",
          border: "1px solid #bbb",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Volver a la lista
      </button>
    </div>
  );
}

export default AddBookPage;