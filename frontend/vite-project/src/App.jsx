import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AddBookPage from "./pages/AddBookPage";
import BookTable from "./components/tables/BookTable";

// Componente wrapper para pasar navigateToList a AddBookPage
function AddBookPageWithNav() {
  const navigate = useNavigate();
  return <AddBookPage navigateToList={() => navigate("/books")} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/books" element={<BookTable />} />
        <Route path="/books/new" element={<AddBookPageWithNav />} />
      </Routes>
    </Router>
  );
}

export default App;