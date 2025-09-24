import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { People as PeopleIcon, Work as WorkIcon, Assessment as AssessmentIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'Resumen General',
      icon: <AssessmentIcon />, // reutilizamos icono para consistencia
      path: '/',
    },
    {
      text: 'Gestión de Usuarios',
      icon: <PeopleIcon />,
      path: '/usuarios',
    },
    {
      text: 'Supervisión de Ofertas',
      icon: <WorkIcon />,
      path: '/ofertas',
    },
    {
      text: 'Reportes',
      icon: <AssessmentIcon />,
      path: '/reportes',
    },
  ];

  return (
    <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" color="primary.contrastText">
          Panel Principal
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

export default Sidebar;
