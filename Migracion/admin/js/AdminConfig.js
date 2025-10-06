/**
 * AdminConfig.js
 * Configuración global y constantes para el Panel de Administrador
 * Preparado para integración con Django REST API
 */

const AdminConfig = {
  /**
   * API Configuration
   * TODO: Reemplazar con las URLs reales del backend Django cuando esté listo
   */
  api: {
    baseURL: '/api/v1', // Base URL para todas las peticiones API
    endpoints: {
      // Usuarios
      users: '/users',
      userDetail: (id) => `/users/${id}`,
      
      // Ofertas
      offers: '/offers',
      offerDetail: (id) => `/offers/${id}`,
      offerApprove: (id) => `/offers/${id}/approve`,
      offerReject: (id) => `/offers/${id}/reject`,
      
      // Reportes
      reports: '/reports',
      reportGenerate: '/reports/generate',
      
      // Dashboard stats
      dashboardStats: '/dashboard/stats',
      recentActivity: '/dashboard/activity',
      
      // Autenticación (manejado por otro compañero)
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
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
      totalUsers: 1245,
      pendingOffers: 32,
      activeInternships: 187,
    },
    
    // Actividad reciente
    recentActivity: [
      {
        id: 1,
        description: 'Nuevo usuario registrado: Juan Pérez',
        time: 'Hace 5 minutos',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: 2,
        description: 'Oferta "Desarrollador Web" publicada por Empresa XYZ',
        time: 'Hace 1 hora',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        id: 3,
        description: 'Estudiante María García aplicó a "Diseñador UI/UX"',
        time: 'Hace 3 horas',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        id: 4,
        description: 'Oferta "Análisis de Datos" aprobada por el administrador',
        time: 'Ayer',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: 5,
        description: 'Reporte de actividad semanal generado',
        time: 'Hace 2 días',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
    
    // Acciones rápidas
    quickActions: [
      {
        id: 1,
        title: 'Gestionar Usuarios',
        description: 'Administrar usuarios del sistema',
        icon: 'people',
        route: '/usuarios',
      },
      {
        id: 2,
        title: 'Revisar Ofertas',
        description: 'Supervisar ofertas de prácticas',
        icon: 'work',
        route: '/ofertas',
      },
      {
        id: 3,
        title: 'Generar Reporte',
        description: 'Crear reportes de actividad',
        icon: 'assessment',
        route: '/reportes',
      },
      {
        id: 4,
        title: 'Configuración del Sistema',
        description: 'Ajustar configuraciones',
        icon: 'settings',
        route: '/configuracion',
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
        text: 'Resumen General',
        icon: 'assessment',
        path: '/',
        active: true,
      },
      {
        id: 'users',
        text: 'Gestión de Usuarios',
        icon: 'people',
        path: '/usuarios',
        active: false,
      },
      {
        id: 'offers',
        text: 'Supervisión de Ofertas',
        icon: 'work',
        path: '/ofertas',
        active: false,
      },
      {
        id: 'reports',
        text: 'Reportes',
        icon: 'assessment',
        path: '/reportes',
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
  const url = `${AdminConfig.api.baseURL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...AdminConfig.api.headers,
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
  module.exports = { AdminConfig, apiRequest };
}
