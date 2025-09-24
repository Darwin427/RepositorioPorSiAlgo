import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/Layout/Layout';
import CompanyLayout from './components/Layout/CompanyLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import UserManagement from './pages/UserManagement/UserManagement';
import OfferManagement from './pages/OfferManagement/OfferManagement';
import Reports from './pages/Reports/Reports';
import CompanyDashboard from './pages/Company/CompanyDashboard';
import CompanyOffers from './pages/Company/CompanyOffers';
import CompanyOfferForm from './pages/Company/CompanyOfferForm';
import CompanyOfferDetail from './pages/Company/CompanyOfferDetail';
import CompanyApplicants from './pages/Company/CompanyApplicants';
import CompanyOfferEdit from './pages/Company/CompanyOfferEdit';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/usuarios" element={<UserManagement />} />
          <Route path="/ofertas" element={<OfferManagement />} />
          <Route path="/reportes" element={<Reports />} />
        </Route>

        <Route path="/empresa" element={<CompanyLayout />}>
          <Route index element={<CompanyDashboard />} />
          <Route path="ofertas" element={<CompanyOffers />} />
          <Route path="ofertas/nueva" element={<CompanyOfferForm />} />
          <Route path="ofertas/:id" element={<CompanyOfferDetail />} />
          <Route path="ofertas/:id/editar" element={<CompanyOfferEdit />} />
          <Route path="ofertas/:id/postulantes" element={<CompanyApplicants />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
