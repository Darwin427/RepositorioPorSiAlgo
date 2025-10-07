/**
 * AdminAPI.js
 * Capa de abstracción para comunicación con Django REST API
 * Maneja autenticación, peticiones HTTP, y manejo de errores
 */

const AdminAPI = {
  /**
   * Configuración base
   */
  config: {
    // IMPORTANTE: Actualizar esta URL cuando Django esté en producción
    baseURL: window.location.hostname === 'localhost' 
      ? 'http://localhost:8000/api/v1'  // Desarrollo local
      : '/api/v1',  // Producción (mismo dominio)
    
    timeout: 30000,
    
    // Token de autenticación (se obtiene del localStorage)
    getAuthToken: () => {
      return localStorage.getItem('admin_auth_token');
    },
    
    // Headers por defecto
    getHeaders: () => {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      const token = AdminAPI.config.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      return headers;
    },
  },

  /**
   * Método genérico para hacer peticiones HTTP
   * @param {string} endpoint - Endpoint relativo (ej: '/users')
   * @param {object} options - Opciones de fetch
   * @returns {Promise} Respuesta parseada
   */
  async request(endpoint, options = {}) {
    const url = `${this.config.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...this.config.getHeaders(),
        ...options.headers,
      },
    };

    // Agregar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Manejar respuestas según código de estado
      if (response.status === 401) {
        // Token expirado o inválido
        this.handleUnauthorized();
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
      }

      if (response.status === 403) {
        throw new Error('No tienes permisos para realizar esta acción.');
      }

      if (response.status === 404) {
        throw new Error('Recurso no encontrado.');
      }

      if (response.status === 500) {
        throw new Error('Error del servidor. Intenta nuevamente más tarde.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      // Respuesta exitosa
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('La petición tardó demasiado tiempo. Verifica tu conexión.');
      }
      
      throw error;
    }
  },

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  },

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },

  /**
   * Upload de archivos (multipart/form-data)
   */
  async upload(endpoint, formData) {
    const headers = { ...this.config.getHeaders() };
    delete headers['Content-Type']; // Dejar que el navegador lo establezca

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  },

  /**
   * Maneja respuesta 401 (no autorizado)
   */
  handleUnauthorized() {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_user_data');
    
    // Redirigir al login
    window.location.href = '/login.html';
  },

  /**
   * Guarda el token de autenticación
   */
  setAuthToken(token) {
    localStorage.setItem('admin_auth_token', token);
  },

  /**
   * Guarda datos del usuario
   */
  setUserData(userData) {
    localStorage.setItem('admin_user_data', JSON.stringify(userData));
  },

  /**
   * Obtiene datos del usuario
   */
  getUserData() {
    const data = localStorage.getItem('admin_user_data');
    return data ? JSON.parse(data) : null;
  },

  /**
   * Cierra sesión
   */
  logout() {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_user_data');
    window.location.href = '/login.html';
  },

  // ============================================
  // ENDPOINTS ESPECÍFICOS PARA DJANGO
  // ============================================

  /**
   * AUTENTICACIÓN
   */
  auth: {
    async login(email, password) {
      const response = await AdminAPI.post('/auth/login/', {
        email,
        password,
      });
      
      if (response.token) {
        AdminAPI.setAuthToken(response.token);
        AdminAPI.setUserData(response.user);
      }
      
      return response;
    },

    async logout() {
      try {
        await AdminAPI.post('/auth/logout/');
      } finally {
        AdminAPI.logout();
      }
    },

    async refreshToken() {
      const response = await AdminAPI.post('/auth/refresh/');
      if (response.token) {
        AdminAPI.setAuthToken(response.token);
      }
      return response;
    },

    async getCurrentUser() {
      return AdminAPI.get('/auth/me/');
    },
  },

  /**
   * USUARIOS
   */
  users: {
    async list(params = {}) {
      // params: { page, page_size, search, type, status, ordering }
      return AdminAPI.get('/users/', params);
    },

    async get(userId) {
      return AdminAPI.get(`/users/${userId}/`);
    },

    async create(userData) {
      return AdminAPI.post('/users/', userData);
    },

    async update(userId, userData) {
      return AdminAPI.put(`/users/${userId}/`, userData);
    },

    async partialUpdate(userId, userData) {
      return AdminAPI.patch(`/users/${userId}/`, userData);
    },

    async delete(userId) {
      return AdminAPI.delete(`/users/${userId}/`);
    },

    async export(params = {}) {
      return AdminAPI.get('/users/export/', params);
    },

    async stats() {
      return AdminAPI.get('/users/stats/');
    },

    async getDocument(userId, documentId) {
      return AdminAPI.get(`/users/${userId}/documents/${documentId}/`);
    },

    async downloadDocument(userId, documentId) {
      const response = await fetch(
        `${AdminAPI.config.baseURL}/users/${userId}/documents/${documentId}/download/`,
        {
          headers: AdminAPI.config.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Error al descargar el documento');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Obtener nombre del archivo del header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `documento_${documentId}.pdf`;
      
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  },

  /**
   * OFERTAS
   */
  offers: {
    async list(params = {}) {
      // params: { page, page_size, search, status, company, ordering }
      return AdminAPI.get('/offers/', params);
    },

    async get(offerId) {
      return AdminAPI.get(`/offers/${offerId}/`);
    },

    async approve(offerId, data = {}) {
      return AdminAPI.post(`/offers/${offerId}/approve/`, data);
    },

    async reject(offerId, reason) {
      return AdminAPI.post(`/offers/${offerId}/reject/`, { reason });
    },

    async close(offerId) {
      return AdminAPI.post(`/offers/${offerId}/close/`);
    },

    async export(params = {}) {
      return AdminAPI.get('/offers/export/', params);
    },

    async stats() {
      return AdminAPI.get('/offers/stats/');
    },
  },

  /**
   * REPORTES
   */
  reports: {
    async list(params = {}) {
      return AdminAPI.get('/reports/', params);
    },

    async generate(reportData) {
      // reportData: { type, start_date, end_date, format }
      return AdminAPI.post('/reports/generate/', reportData);
    },

    async get(reportId) {
      return AdminAPI.get(`/reports/${reportId}/`);
    },

    async download(reportId) {
      const response = await fetch(
        `${AdminAPI.config.baseURL}/reports/${reportId}/download/`,
        {
          headers: AdminAPI.config.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Error al descargar el reporte');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Obtener nombre del archivo del header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `reporte_${reportId}.pdf`;
      
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    },

    async delete(reportId) {
      return AdminAPI.delete(`/reports/${reportId}/`);
    },
  },

  /**
   * DASHBOARD
   */
  dashboard: {
    async getStats() {
      return AdminAPI.get('/dashboard/stats/');
    },

    async getActivity(params = {}) {
      // params: { limit }
      return AdminAPI.get('/dashboard/activity/', params);
    },

    async getChartData(chartType, params = {}) {
      return AdminAPI.get(`/dashboard/charts/${chartType}/`, params);
    },
  },

  /**
   * EMPRESAS
   */
  companies: {
    async list(params = {}) {
      return AdminAPI.get('/companies/', params);
    },

    async get(companyId) {
      return AdminAPI.get(`/companies/${companyId}/`);
    },

    async update(companyId, companyData) {
      return AdminAPI.put(`/companies/${companyId}/`, companyData);
    },

    async verify(companyId) {
      return AdminAPI.post(`/companies/${companyId}/verify/`);
    },

    async stats() {
      return AdminAPI.get('/companies/stats/');
    },
  },

  /**
   * ESTUDIANTES
   */
  students: {
    async list(params = {}) {
      return AdminAPI.get('/students/', params);
    },

    async get(studentId) {
      return AdminAPI.get(`/students/${studentId}/`);
    },

    async stats() {
      return AdminAPI.get('/students/stats/');
    },
  },

  /**
   * POSTULACIONES
   */
  applications: {
    async list(params = {}) {
      return AdminAPI.get('/applications/', params);
    },

    async get(applicationId) {
      return AdminAPI.get(`/applications/${applicationId}/`);
    },

    async stats() {
      return AdminAPI.get('/applications/stats/');
    },
  },
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminAPI;
}
