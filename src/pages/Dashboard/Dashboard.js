import React from 'react';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';
import { People as PeopleIcon, Work as WorkIcon, School as SchoolIcon } from '@mui/icons-material';

const Dashboard = () => {
  const summaryCards = [
    {
      title: 'Total Usuarios',
      value: '1,245',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: 'Ofertas Pendientes',
      value: '32',
      icon: <WorkIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
    },
    {
      title: 'Prácticas en Curso',
      value: '187',
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    },
  ];

  const recentActivities = [
    {
      description: 'Nuevo usuario registrado: Juan Pérez',
      time: 'Hace 5 minutos',
    },
    {
      description: 'Oferta "Desarrollador Web" publicada por Empresa XYZ',
      time: 'Hace 1 hora',
    },
    {
      description: 'Estudiante María García aplicó a "Diseñador UI/UX"',
      time: 'Hace 3 horas',
    },
    {
      description: 'Oferta "Análisis de Datos" aprobada por el administrador',
      time: 'Ayer',
    },
    {
      description: 'Reporte de actividad semanal generado',
      time: 'Hace 2 días',
    },
  ];

  const quickActions = [
    {
      title: 'Gestionar Usuarios',
      description: 'Administrar usuarios del sistema',
    },
    {
      title: 'Revisar Ofertas',
      description: 'Supervisar ofertas de prácticas',
    },
    {
      title: 'Generar Reporte',
      description: 'Crear reportes de actividad',
    },
    {
      title: 'Configuración del Sistema',
      description: 'Ajustar configuraciones',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff' }}>
        Panel de Administración
      </Typography>

      {/* Resumen General */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#ffffff' }}>
          Resumen General
        </Typography>
        <Grid container spacing={3}>
          {summaryCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {card.icon}
                    <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                      {card.title}
                    </Typography>
                  </Box>
                  <Typography variant="h3" component="div" color="primary.main">
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Actividad Reciente */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Actividad Reciente
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} divider={index < recentActivities.length - 1}>
                    <ListItemText
                      primary={activity.description}
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Acciones Rápidas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Acciones Rápidas
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        height: '80px',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" component="div">
                          {action.title}
                        </Typography>
                        <Typography variant="caption" component="div" sx={{ mt: 1 }}>
                          {action.description}
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
