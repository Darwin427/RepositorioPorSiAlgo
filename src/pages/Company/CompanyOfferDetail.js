import React from 'react';
import { Box, Typography, Chip, Grid, Card, CardContent, Button } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const mockById = {
  '1': { id: '1', title: 'Prácticas Frontend', status: 'Publicada', applicants: 12, location: 'Remoto', description: 'Construcción de componentes UI con React.' },
  '2': { id: '2', title: 'Prácticas Backend', status: 'Pausada', applicants: 8, location: 'Medellín', description: 'APIs con Node.js y bases de datos.' },
  'd1': { id: 'd1', title: 'Prácticas Data Analyst', status: 'Borrador', applicants: 0, location: 'Híbrido', description: 'Análisis de datos y dashboards.' },
};

const CompanyOfferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const offer = mockById[id] || mockById['1'];

  const handleBack = () => {
    const from = location.state && location.state.from;
    if (from && typeof from.tab === 'number') {
      navigate('/empresa/ofertas', { state: { tab: from.tab, page: from.page } });
    } else {
      navigate('/empresa/ofertas');
    }
  };

  return (
    <Box>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={handleBack}>Volver</Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h5" sx={{ color: '#ffffff' }}>{offer.title}</Typography>
        <Chip size="small" label={offer.status} color={offer.status === 'Publicada' ? 'primary' : 'default'} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Descripción</Typography>
              <Typography variant="body2" color="text.secondary">{offer.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Información</Typography>
              <Typography variant="body2">Ubicación: {offer.location}</Typography>
              <Typography variant="body2">Postulantes: {offer.applicants}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button variant="contained" onClick={() => navigate(`/empresa/ofertas/${offer.id}/postulantes`)}>Ver postulantes</Button>
                <Button variant="outlined" onClick={() => navigate(`/empresa/ofertas/${offer.id}/editar`)}>Editar</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyOfferDetail;


