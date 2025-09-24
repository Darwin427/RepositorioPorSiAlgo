import React from 'react';
import { Box, Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard = () => {
  const summary = [
    { label: 'Ofertas activas', value: 3 },
    { label: 'Borradores', value: 2 },
    { label: 'Nuevas postulaciones', value: 5 },
  ];

  const recent = [
    { description: 'Publicaste "Prácticas Frontend"', time: 'Hace 30 min' },
    { description: '2 nuevos postulantes en "Backend"', time: 'Hace 1 h' },
    { description: 'Guardaste borrador "Data Analyst"', time: 'Ayer' },
  ];

  const navigate = useNavigate();
  const quickActions = [
    { title: 'Crear nueva oferta', description: 'Publica una posición', action: () => navigate('/empresa/ofertas/nueva') },
    { title: 'Ver mis ofertas', description: 'Gestiona y edita', action: () => navigate('/empresa/ofertas') },
    { title: 'Ver borradores', description: 'Continúa tus ofertas guardadas', action: () => navigate('/empresa/ofertas') },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff' }}>
        Panel de Empresa
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#ffffff' }}>
          Resumen General
        </Typography>
        <Grid container spacing={3}>
          {summary.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.label}>
              <Card>
                <CardContent>
                  <Typography variant="h3" component="div" color="primary.main">
                    {item.value}
                  </Typography>
                  <Typography color="text.secondary">{item.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Actividad Reciente
              </Typography>
              <List>
                {recent.map((r, i) => (
                  <ListItem key={i} divider={i < recent.length - 1}>
                    <ListItemText primary={r.description} secondary={r.time} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Acciones Rápidas
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((qa, i) => (
                  <Grid item xs={6} key={i}>
                    <Button variant="contained" fullWidth sx={{ height: '80px' }} onClick={qa.action}>
                      <Box>
                        <Typography variant="body2">{qa.title}</Typography>
                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>{qa.description}</Typography>
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

export default CompanyDashboard;


