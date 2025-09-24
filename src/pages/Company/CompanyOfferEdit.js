import React, { useState } from 'react';
import { Box, TextField, Grid, Button, Paper, Typography, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const mockOffer = {
  title: 'Prácticas Frontend',
  location: 'Remoto',
  description: 'Construcción de componentes UI con React.',
};

const CompanyOfferEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleBack = () => {
    const from = location.state && location.state.from;
    if (from && typeof from.tab === 'number') {
      navigate('/empresa/ofertas', { state: { tab: from.tab, page: from.page } });
    } else {
      navigate('/empresa/ofertas');
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={handleBack}>Volver</Button>
      <Typography variant="h6" sx={{ mb: 2 }}>Editar Oferta (#{id})</Typography>
      <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Título" defaultValue={mockOffer.title} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Ubicación" defaultValue={mockOffer.location} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline minRows={4} label="Descripción" defaultValue={mockOffer.description} />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained" color="primary">Guardar cambios (mock)</Button>
            <Button variant="outlined">Cancelar</Button>
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={2500} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Cambios guardados (mock)
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CompanyOfferEdit;


