import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, Avatar, TextField, InputAdornment, Menu, MenuItem } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, Search as SearchIcon, Logout as LogoutIcon } from '@mui/icons-material';
import Sidebar from '../Sidebar/Sidebar';
import { drawerWidth } from '../../constants/layout';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAvatarClick = (event) => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAvatarAnchorEl(null);
  };

  const goToCompanyPanel = () => {
    handleMenuClose();
    navigate('/empresa');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menú"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" noWrap component="div" sx={{ mr: 4, color: '#ffffff' }}>
              INSTITUCIÓN UNIVERSITARIA PASCUAL BRAVO
            </Typography>
            <Typography variant="body2" sx={{ mr: 4, opacity: 0.8, color: '#ffffff' }}>
              Acreditados en Alta Calidad
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder="Buscar usuarios, ofertas..."
            sx={{ 
              mr: 2, 
              '& .MuiOutlinedInput-root': { 
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '20px',
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <IconButton color="inherit" sx={{ mr: 1 }}>
            <LogoutIcon />
          </IconButton>
          
          <Avatar sx={{ width: 32, height: 32, cursor: 'pointer' }} onClick={handleAvatarClick}>A</Avatar>
          <Menu
            anchorEl={avatarAnchorEl}
            open={Boolean(avatarAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={goToCompanyPanel}>Ir al Panel de Empresa</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(255,255,255,0.08)'
            },
          }}
        >
          <Sidebar />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(255,255,255,0.08)'
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
