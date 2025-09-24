import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Dashboard as DashboardIcon, Work as WorkIcon, AddCircleOutline as AddIcon, Assessment as AssessmentIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const CompanySidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Panel General', icon: <AssessmentIcon />, path: '/empresa' },
    { text: 'Mis Ofertas', icon: <WorkIcon />, path: '/empresa/ofertas' },
    { text: 'Nueva Oferta', icon: <AddIcon />, path: '/empresa/ofertas/nueva' },
  ];

  return (
    <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" color="primary.contrastText">
          Panel Empresa
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                color: 'primary.contrastText',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(245, 180, 0, 0.18)',
                  color: '#ffffff',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CompanySidebar;


