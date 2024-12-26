import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png'; // Import the logo

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Drawer contents for mobile menu
  const drawer = (
    <Box sx={{ width: 250, padding: '10px' }}>
      <Typography variant="h6" component="div" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
        Greenhouse Monitor
      </Typography>
      <List>
        {isAuthenticated ? (
          <>
            <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/control-panel" onClick={handleDrawerToggle}>
              <ListItemText primary="Control Panel" />
            </ListItem>
            <ListItem button component={Link} to="/plant-health" onClick={handleDrawerToggle}>
              <ListItemText primary="Plant Health" />
            </ListItem>
            <ListItem button component={Link} to="/plant-classification" onClick={handleDrawerToggle}>
              <ListItemText primary="Plant Classification" />
            </ListItem>
            <ListItem button component={Link} to="/profile" onClick={handleDrawerToggle}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => { logout(); handleDrawerToggle(); }}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login" onClick={handleDrawerToggle}>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/sign-up" onClick={handleDrawerToggle}>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ backgroundColor: '#1976d2', padding: { xs: '0 10px', sm: '0 20px' } }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logo}
              alt="Greenhouse Logo"
              style={{ height: '40px', marginRight: '10px' }}
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#fff' }}>
              Greenhouse Monitor
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: '10px' }}>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/control-panel">
                  Control Panel
                </Button>
                <Button color="inherit" component={Link} to="/plant-health">
                  Plant Health
                </Button>
                <Button color="inherit" component={Link} to="/plant-classification">
                  Plant Classification
                </Button>
                <Button color="inherit" component={Link} to="/profile">
                  Profile
                </Button>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/sign-up">
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu (Hamburger Icon) */}
          <IconButton 
            color="inherit" 
            aria-label="open drawer" 
            edge="end" 
            sx={{ display: { sm: 'none' } }} 
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Menu */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
