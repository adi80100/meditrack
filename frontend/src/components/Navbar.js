import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MediTrack
        </Typography>
        {user && (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 