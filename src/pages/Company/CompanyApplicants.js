import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Chip, Paper, Button } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const mockApplicants = {
  '1': [
    { id: 'a1', name: 'Ana Gómez', status: 'Recibida' },
    { id: 'a2', name: 'Luis Pérez', status: 'En revisión' },
  ],
  '2': [
    { id: 'a3', name: 'María López', status: 'Recibida' },
  ],
  'd1': [],
};

const CompanyApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const applicants = mockApplicants[id] ?? [];

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
      <Typography variant="h6" sx={{ mb: 2, color: '#ffffff' }}>Postulantes</Typography>
      <Paper elevation={1}>
        <List>
          {applicants.length === 0 && (
            <ListItem>
              <ListItemText primary="Sin postulantes" secondary="Aún no hay personas postuladas." />
            </ListItem>
          )}
          {applicants.map((a) => (
            <ListItem key={a.id} secondaryAction={<Chip size="small" label={a.status} />}>
              <ListItemText primary={a.name} secondary={`ID: ${a.id}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CompanyApplicants;


