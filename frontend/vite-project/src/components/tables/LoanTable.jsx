import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  IconButton,
  TablePagination,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import apiClient from "../../api/apiClient";

const LoanTable = ({ onEdit }) => {
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchLoans = async () => {
    try {
      const response = await apiClient.get("/loans");
      setLoans(response.data);
    } catch (error) {
      alert("Error al cargar los préstamos: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) return;
    try {
      await apiClient.delete(`/loans/${id}`);
      fetchLoans();
    } catch (error) {
      alert("Error al eliminar el préstamo: " + (error.response?.data?.error || "Error desconocido"));
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const filteredLoans = loans.filter((loan) => {
    const userName = loan.user?.name || "";
    const bookTitle = loan.book?.title || "";
    return (
      userName.toLowerCase().includes(search.toLowerCase()) ||
      bookTitle.toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginatedLoans = filteredLoans.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TextField
        label="Buscar"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        fullWidth
        sx={{ marginBottom: 2, marginTop: 2 }}
      />
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Libro</TableCell>
              <TableCell>Fecha de Préstamo</TableCell>
              <TableCell>Fecha de Devolución</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLoans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.user?.name}</TableCell>
                <TableCell>{loan.book?.title}</TableCell>
                <TableCell>{loan.borrow_date || loan.borrowDate}</TableCell>
                <TableCell>{loan.return_date || loan.returnDate || "Pendiente"}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton color="primary" onClick={() => onEdit(loan)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(loan.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredLoans.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default LoanTable;
