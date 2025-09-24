import React, { useState } from 'react';
import { Box, TextField, Grid, Button, Paper, Typography, Snackbar, Alert } from '@mui/material';

const CompanyOfferForm = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Nueva Oferta (Prototipo)</Typography>
      <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Título" placeholder="Título de la oferta" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Ubicación" placeholder="Ciudad / Remoto" />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline minRows={4} label="Descripción" placeholder="Describe las funciones y requisitos" />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained" color="primary">Guardar (mock)</Button>
            <Button variant="outlined">Cancelar</Button>
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={2500} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Oferta guardada (mock)
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CompanyOfferForm;


