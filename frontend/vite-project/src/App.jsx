import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddBookPage from "./pages/AddBookPage";
import BookListPage from "./pages/BookListPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/books" element={<BookListPage />} />
        <Route path="/books/new" element={<AddBookPage />} />
      </Routes>
    </Router>
  );
}

export default App;