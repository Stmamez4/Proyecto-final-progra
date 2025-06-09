import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import AddBookPage from "./pages/AddBookPage";
import BookListPage from "./pages/BookListPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/books" element={<BookListPage />} />
        <Route path="/books/new" element={<AddBookPage />} />

        <Route path="*" element={<Navigate to="/books" />} />
      </Routes>
    </Router>
  );
}

export default App;