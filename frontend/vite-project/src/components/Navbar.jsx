import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Biblioteca
        </Typography>
        <Button color="inherit" component={Link} to="/books">
          Libros
        </Button>
        <Button color="inherit" component={Link} to="/books/new">
          Agregar Libro
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
