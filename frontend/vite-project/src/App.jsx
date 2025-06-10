import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import AddBookPage from "./pages/AddBookPage";
import BookListPage from "./pages/BookListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import UserListPage from "./pages/UserListPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/new" element={<AddBookPage />} />
          <Route path="/users" element={<UserListPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/books" />} />
      </Routes>
    </Router>
  );
}

export default App;