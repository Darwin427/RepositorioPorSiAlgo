import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Grid, Card, CardContent, Typography, Chip, Button, Paper, Skeleton, Snackbar, Alert, CardActionArea } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const mockPublished = Array.from({ length: 18 }).map((_, i) => ({
  id: String(i + 1),
  title: `Oferta Publicada ${i + 1}`,
  applicants: Math.floor(Math.random() * 40),
  status: i % 5 === 0 ? 'Pausada' : 'Publicada',
}));
const mockDrafts = Array.from({ length: 7 }).map((_, i) => ({
  id: `d${i + 1}`,
  title: `Borrador ${i + 1}`,
  applicants: 0,
  status: 'Borrador',
}));

const CompanyOffers = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state.tab !== undefined || location.state.page)) {
      if (location.state.tab !== undefined) setTab(location.state.tab);
      if (location.state.page) setPage(location.state.page);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [tab, page]);

  const handleTabChange = (_, v) => {
    setTab(v);
    setLoading(true);
    setSnackbarMsg(v === 0 ? 'Mostrando ofertas publicadas' : 'Mostrando borradores');
    setSnackbarOpen(true);
  };
  const data = tab === 0 ? mockPublished : mockDrafts;

  const paged = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box>
      <Tabs 
        value={tab} 
        onChange={handleTabChange} 
        textColor="inherit"
        sx={{ 
          mb: 2,
          '& .MuiTabs-indicator': { backgroundColor: 'secondary.main' },
        }}
      >
        <Tab label="Publicadas" sx={{ color: '#ffffff', '&.Mui-selected': { color: '#ffffff' } }} />
        <Tab label="Borradores" sx={{ color: '#ffffff', '&.Mui-selected': { color: '#ffffff' } }} />
      </Tabs>
      {loading ? (
        <Grid container spacing={2}>
          {[1,2,3,4].map((s) => (
            <Grid item xs={12} md={6} key={s}>
              <Card elevation={1}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={28} />
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="rectangular" height={36} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : data.length === 0 ? (
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Aún no tienes ofertas aquí</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Empieza creando tu primera oferta. También puedes guardar como borrador para publicar luego.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/empresa/ofertas/nueva')}>Crear oferta</Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {paged.map((offer) => (
            <Grid item xs={12} md={6} key={offer.id}>
              <Card elevation={1}>
                <CardActionArea onClick={() => navigate(`/empresa/ofertas/${offer.id}`, { state: { from: { tab, page } } })}>
                  <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{offer.title}</Typography>
                    <Chip size="small" label={offer.status} color={offer.status === 'Publicada' ? 'primary' : 'default'} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Postulantes: {offer.applicants}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button size="small" variant="text" onClick={(e) => { e.stopPropagation(); navigate(`/empresa/ofertas/${offer.id}`, { state: { from: { tab, page } } }); }}>Detalle</Button>
                    <Button size="small" variant="text" onClick={(e) => { e.stopPropagation(); navigate(`/empresa/ofertas/${offer.id}/postulantes`, { state: { from: { tab, page } } }); }}>Postulantes</Button>
                    <Button size="small" variant="text" onClick={(e) => { e.stopPropagation(); navigate(`/empresa/ofertas/${offer.id}/editar`, { state: { from: { tab, page } } }); }}>Editar</Button>
                  </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, data.length)} de {data.length}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
                <Button disabled={page * pageSize >= data.length} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" variant="filled" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyOffers;


