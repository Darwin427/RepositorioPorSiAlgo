import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const OfferManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const offers = [
    {
      id: 1,
      title: 'Desarrollador Web',
      company: 'Empresa XYZ',
      location: 'Medellín',
      type: 'Presencial',
      status: 'Pendiente',
      applications: 15,
      publishedDate: '2024-01-20',
      description: 'Buscamos desarrollador web con experiencia en React y Node.js',
    },
    {
      id: 2,
      title: 'Diseñador UI/UX',
      company: 'Tech Solutions',
      location: 'Remoto',
      type: 'Remoto',
      status: 'Aprobada',
      applications: 8,
      publishedDate: '2024-01-18',
      description: 'Diseñador UI/UX para proyectos de aplicaciones móviles',
    },
    {
      id: 3,
      title: 'Análisis de Datos',
      company: 'Data Corp',
      location: 'Bogotá',
      type: 'Presencial',
      status: 'Rechazada',
      applications: 12,
      publishedDate: '2024-01-15',
      description: 'Analista de datos con conocimientos en Python y SQL',
    },
    {
      id: 4,
      title: 'Marketing Digital',
      company: 'Digital Agency',
      location: 'Medellín',
      type: 'Híbrido',
      status: 'Pendiente',
      applications: 6,
      publishedDate: '2024-01-22',
      description: 'Especialista en marketing digital y redes sociales',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprobada':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Rechazada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Presencial':
        return 'primary';
      case 'Remoto':
        return 'secondary';
      case 'Híbrido':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOffer(null);
  };

  const handleApproveOffer = (offerId) => {
    // Lógica para aprobar oferta
    console.log('Aprobar oferta:', offerId);
  };

  const handleRejectOffer = (offerId) => {
    // Lógica para rechazar oferta
    console.log('Rechazar oferta:', offerId);
  };

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#ffffff' }}>
          Supervisión de Ofertas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: '#1976d2' }}
        >
          Nueva Oferta
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Buscar ofertas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: '300px' }}
            />
            <Typography variant="body2" color="text.secondary">
              {filteredOffers.length} ofertas encontradas
            </Typography>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Aplicaciones</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>{offer.title}</TableCell>
                    <TableCell>{offer.company}</TableCell>
                    <TableCell>{offer.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={offer.type}
                        color={getTypeColor(offer.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={offer.status}
                        color={getStatusColor(offer.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{offer.applications}</TableCell>
                    <TableCell>{offer.publishedDate}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewOffer(offer)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="secondary">
                        <EditIcon />
                      </IconButton>
                      {offer.status === 'Pendiente' && (
                        <>
                          <IconButton
                            color="success"
                            onClick={() => handleApproveOffer(offer.id)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleRejectOffer(offer.id)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Detalles de la Oferta</DialogTitle>
        <DialogContent>
          {selectedOffer && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedOffer.title}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Empresa:</strong> {selectedOffer.company}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Ubicación:</strong> {selectedOffer.location}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Tipo:</strong> {selectedOffer.type}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Estado:</strong> {selectedOffer.status}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Aplicaciones:</strong> {selectedOffer.applications}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Fecha de Publicación:</strong> {selectedOffer.publishedDate}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Descripción:</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOffer.description}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OfferManagement;
