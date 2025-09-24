import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reportType, setReportType] = useState('');

  const reports = [
    {
      id: 1,
      title: 'Reporte de Usuarios Activos',
      type: 'Usuarios',
      description: 'Lista de usuarios activos en el sistema',
      generatedDate: '2024-01-22',
      status: 'Completado',
      fileSize: '2.5 MB',
    },
    {
      id: 2,
      title: 'Reporte de Ofertas por Empresa',
      type: 'Ofertas',
      description: 'Análisis de ofertas publicadas por cada empresa',
      generatedDate: '2024-01-21',
      status: 'Completado',
      fileSize: '1.8 MB',
    },
    {
      id: 3,
      title: 'Reporte de Prácticas en Curso',
      type: 'Prácticas',
      description: 'Estado actual de las prácticas en desarrollo',
      generatedDate: '2024-01-20',
      status: 'Completado',
      fileSize: '3.2 MB',
    },
    {
      id: 4,
      title: 'Reporte de Aplicaciones por Estudiante',
      type: 'Aplicaciones',
      description: 'Número de aplicaciones realizadas por cada estudiante',
      generatedDate: '2024-01-19',
      status: 'En Proceso',
      fileSize: '-',
    },
  ];

  const reportTypes = [
    { value: 'usuarios', label: 'Usuarios' },
    { value: 'ofertas', label: 'Ofertas' },
    { value: 'practicas', label: 'Prácticas' },
    { value: 'aplicaciones', label: 'Aplicaciones' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return 'success';
      case 'En Proceso':
        return 'warning';
      case 'Error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Usuarios':
        return <PeopleIcon />;
      case 'Ofertas':
        return <WorkIcon />;
      case 'Prácticas':
        return <SchoolIcon />;
      default:
        return <AssessmentIcon />;
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
  };

  const handleGenerateReport = () => {
    // Lógica para generar nuevo reporte
    console.log('Generar reporte:', reportType);
  };

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#ffffff' }}>
          Reportes
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Tipo de Reporte</InputLabel>
            <Select
              value={reportType}
              label="Tipo de Reporte"
              onChange={(e) => setReportType(e.target.value)}
            >
              {reportTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleGenerateReport}
            disabled={!reportType}
            sx={{ backgroundColor: '#1976d2' }}
          >
            Generar Reporte
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Usuarios</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reportes de usuarios
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" color="primary">
                {reports.filter(r => r.type === 'Usuarios').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon sx={{ fontSize: 40, color: '#dc004e', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Ofertas</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reportes de ofertas
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" color="primary">
                {reports.filter(r => r.type === 'Ofertas').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Prácticas</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reportes de prácticas
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" color="primary">
                {reports.filter(r => r.type === 'Prácticas').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ fontSize: 40, color: '#ed6c02', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Todos los reportes
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" color="primary">
                {reports.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Buscar reportes..."
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
              {filteredReports.length} reportes encontrados
            </Typography>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Fecha de Generación</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Tamaño</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getTypeIcon(report.type)}
                        <Typography sx={{ ml: 1 }}>{report.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.type}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{report.description}</TableCell>
                    <TableCell>{report.generatedDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        color={getStatusColor(report.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{report.fileSize}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewReport(report)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="secondary">
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Reporte</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedReport.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Tipo:</strong> {selectedReport.type}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Descripción:</strong> {selectedReport.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Fecha de Generación:</strong> {selectedReport.generatedDate}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Estado:</strong> {selectedReport.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Tamaño:</strong> {selectedReport.fileSize}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Descargar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;
