/**
 * CompanyConfig.js
 * Configuración global y constantes para el Panel de Empresa
 * Preparado para integración con Django REST API
 */

const CompanyConfig = {
  /**
   * API Configuration
   * TODO: Reemplazar con las URLs reales del backend Django cuando esté listo
   */
  api: {
    baseURL: '/api/v1', // Base URL para todas las peticiones API
    endpoints: {
      // Ofertas de la empresa
      myOffers: '/company/offers',
      offerDetail: (id) => `/company/offers/${id}`,
      createOffer: '/company/offers/create',
      updateOffer: (id) => `/company/offers/${id}/update`,
      deleteOffer: (id) => `/company/offers/${id}/delete`,
      
      // Postulantes
      applicants: (offerId) => `/company/offers/${offerId}/applicants`,
      applicantDetail: (offerId, applicantId) => `/company/offers/${offerId}/applicants/${applicantId}`,
      
      // Dashboard stats
      dashboardStats: '/company/dashboard/stats',
      recentActivity: '/company/dashboard/activity',
      
      // Perfil de empresa
      profile: '/company/profile',
      updateProfile: '/company/profile/update',
    },
    
    // Headers por defecto para peticiones
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    
    // Timeout para peticiones (ms)
    timeout: 30000,
  },

  /**
   * Datos mock para desarrollo
   * Estos datos se reemplazarán con llamadas reales a la API
   */
  mockData: {
    // Estadísticas del dashboard
    dashboardStats: {
      activeOffers: 3,
      drafts: 2,
      newApplications: 5,
    },
    
    // Actividad reciente
    recentActivity: [
      {
        id: 1,
        description: 'Publicaste "Prácticas Frontend"',
        time: 'Hace 30 min',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: 2,
        description: '2 nuevos postulantes en "Backend"',
        time: 'Hace 1 h',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        id: 3,
        description: 'Guardaste borrador "Data Analyst"',
        time: 'Ayer',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ],
    
    // Acciones rápidas
    quickActions: [
      {
        id: 1,
        title: 'Crear nueva oferta',
        description: 'Publica una posición',
        icon: 'add',
        route: '/ofertas/nueva',
      },
      {
        id: 2,
        title: 'Ver mis ofertas',
        description: 'Gestiona y edita',
        icon: 'work',
        route: '/ofertas',
      },
      {
        id: 3,
        title: 'Ver borradores',
        description: 'Continúa tus ofertas guardadas',
        icon: 'draft',
        route: '/ofertas',
      },
    ],
  },

  /**
   * Menú de navegación del sidebar
   */
  navigation: {
    menuItems: [
      {
        id: 'dashboard',
        text: 'Panel Principal',
        icon: 'dashboard',
        path: '/',
        active: true,
      },
      {
        id: 'offers',
        text: 'Mis Ofertas',
        icon: 'work',
        path: '/ofertas',
        active: false,
      },
      {
        id: 'applicants',
        text: 'Postulantes',
        icon: 'people',
        path: '/postulantes',
        active: false,
      },
    ],
  },

  /**
   * Configuración de UI
   */
  ui: {
    // Sidebar
    sidebarWidth: 250,
    sidebarCollapsedWidth: 64,
    
    // AppBar
    appBarHeight: 64,
    
    // Animaciones
    animationDuration: 250,
    
    // Paginación por defecto
    itemsPerPage: 10,
    
    // Breakpoints (deben coincidir con CSS)
    breakpoints: {
      mobile: 576,
      tablet: 768,
      desktop: 992,
      wide: 1200,
    },
  },

  /**
   * Mensajes del sistema
   */
  messages: {
    errors: {
      network: 'Error de conexión. Por favor, verifica tu conexión a internet.',
      server: 'Error del servidor. Intenta nuevamente más tarde.',
      unauthorized: 'No tienes permisos para realizar esta acción.',
      notFound: 'El recurso solicitado no fue encontrado.',
      validation: 'Por favor, verifica los datos ingresados.',
    },
    success: {
      saved: 'Cambios guardados exitosamente.',
      deleted: 'Elemento eliminado exitosamente.',
      created: 'Elemento creado exitosamente.',
      published: 'Oferta publicada exitosamente.',
    },
  },

  /**
   * Utilidades para formateo
   */
  formatters: {
    /**
     * Formatea un número con separadores de miles
     * @param {number} num - Número a formatear
     * @returns {string} Número formateado
     */
    formatNumber: (num) => {
      return new Intl.NumberFormat('es-CO').format(num);
    },

    /**
     * Formatea una fecha relativa (hace X tiempo)
     * @param {Date} date - Fecha a formatear
     * @returns {string} Fecha formateada
     */
    formatRelativeTime: (date) => {
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Justo ahora';
      if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
      if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      
      return date.toLocaleDateString('es-CO');
    },

    /**
     * Formatea una fecha completa
     * @param {Date} date - Fecha a formatear
     * @returns {string} Fecha formateada
     */
    formatDate: (date) => {
      return new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    },
  },
};

/**
 * Función helper para hacer peticiones a la API
 * TODO: Implementar cuando el backend Django esté listo
 * 
 * @param {string} endpoint - Endpoint de la API
 * @param {object} options - Opciones de fetch
 * @returns {Promise} Promesa con la respuesta
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${CompanyConfig.api.baseURL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...CompanyConfig.api.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CompanyConfig, apiRequest };
}
