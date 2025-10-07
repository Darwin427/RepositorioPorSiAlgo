/**
 * AdminRouter.js
 * Sistema de enrutamiento SPA (Single Page Application)
 * Maneja la navegación entre vistas sin recargar la página
 */

const AdminRouter = {
  /**
   * Vista actual activa
   */
  currentView: 'dashboard',

  /**
   * Contenedor principal donde se renderizan las vistas
   */
  viewContainer: null,

  /**
   * Inicializa el router
   */
  init() {
    this.viewContainer = document.getElementById('adminViewContainer');
    
    if (!this.viewContainer) {
      console.error('No se encontró el contenedor de vistas #adminViewContainer');
      return;
    }

    // Cargar vista inicial (dashboard)
    this.navigate('/');
    
    // Manejar navegación con botones del navegador (back/forward)
    window.addEventListener('popstate', (e) => {
      const route = e.state?.route || '/';
      this.navigate(route, false);
    });

    console.log('AdminRouter inicializado');
  },

  /**
   * Navega a una ruta específica
   * @param {string} route - Ruta a navegar (ej: '/', '/usuarios', '/ofertas')
   * @param {boolean} pushState - Si debe agregar al historial del navegador
   */
  navigate(route, pushState = true) {
    // Actualizar historial del navegador
    if (pushState) {
      window.history.pushState({ route }, '', `#${route}`);
    }

    // Actualizar vista actual
    this.currentView = this.getViewNameFromRoute(route);

    // Actualizar menú activo
    this.updateActiveMenuItem(route);

    // Renderizar vista
    this.renderView(this.currentView);

    // Scroll al inicio
    window.scrollTo(0, 0);
  },

  /**
   * Obtiene el nombre de la vista desde la ruta
   * @param {string} route - Ruta
   * @returns {string} Nombre de la vista
   */
  getViewNameFromRoute(route) {
    const routeMap = {
      '/': 'dashboard',
      '/usuarios': 'users',
      '/ofertas': 'offers',
      '/reportes': 'reports',
    };

    return routeMap[route] || 'dashboard';
  },

  /**
   * Actualiza el item activo del menú
   * @param {string} route - Ruta activa
   */
  updateActiveMenuItem(route) {
    const menuItems = document.querySelectorAll('.admin-sidebar__menu-item');
    
    menuItems.forEach(item => {
      const itemRoute = item.dataset.route;
      
      if (itemRoute === route) {
        item.classList.add('admin-sidebar__menu-item--active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('admin-sidebar__menu-item--active');
        item.removeAttribute('aria-current');
      }
    });
  },

  /**
   * Renderiza la vista correspondiente
   * @param {string} viewName - Nombre de la vista a renderizar
   */
  renderView(viewName) {
    const views = {
      dashboard: this.renderDashboardView,
      users: this.renderUsersView,
      offers: this.renderOffersView,
      reports: this.renderReportsView,
    };

    const renderFunction = views[viewName] || views.dashboard;
    
    // Limpiar contenedor
    this.viewContainer.innerHTML = '';
    
    // Renderizar nueva vista
    renderFunction.call(this);

    // Re-inicializar animaciones
    if (typeof AdminUI !== 'undefined') {
      AdminUI.initAnimations();
    }
  },

  /**
   * Renderiza la vista del Dashboard
   */
  renderDashboardView() {
    this.viewContainer.innerHTML = `
      <!-- Título de página -->
      <section class="admin-section">
        <div class="admin-section__header" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 class="admin-section__title">Panel de Administración</h2>
            <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin-top: 4px;">
              Bienvenido, aquí está el resumen de tu sistema
            </p>
          </div>
          <button class="admin-button admin-button--outline" onclick="AdminDashboard.refresh()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="margin-right: 8px;">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            Actualizar
          </button>
        </div>
      </section>

      <!-- Resumen General - PRIMERO -->
      <section class="admin-section">
        <h3 class="admin-section__subtitle">Métricas Principales</h3>
        
        <!-- Cards de estadísticas -->
        <div id="adminSummaryCards" class="admin-grid admin-grid--cols-4">
          <!-- Generado dinámicamente por AdminDashboard.js -->
        </div>
      </section>

      <!-- Alertas y Acciones Rápidas - SEGUNDO -->
      <div class="admin-grid admin-grid--cols-2" style="margin-bottom: 24px; align-items: start;">
        
        <!-- Alertas Importantes -->
        <section class="admin-card">
          <div class="admin-card__header">
            <h3 class="admin-card__title">Alertas Importantes</h3>
          </div>
          <div class="admin-card__body">
            <div id="adminAlerts" style="display: grid; gap: 12px;">
              <!-- Generado dinámicamente por AdminDashboard.js -->
            </div>
          </div>
        </section>

        <!-- Acciones Rápidas -->
        <section class="admin-card">
          <div class="admin-card__header">
            <h3 class="admin-card__title">Acciones Rápidas</h3>
          </div>
          <div class="admin-card__body">
            <div id="adminQuickActions" style="display: grid; gap: 12px;">
              <!-- Generado dinámicamente por AdminDashboard.js -->
            </div>
          </div>
        </section>

      </div>

      <!-- Gráfico y Eventos - TERCERO -->
      <div class="admin-grid admin-grid--cols-3" style="margin-bottom: 24px;">
        
        <!-- Gráfico de Tendencias -->
        <div style="grid-column: span 2;" id="adminCharts">
          <!-- Generado dinámicamente por AdminDashboard.js -->
        </div>

        <!-- Próximos Eventos -->
        <div id="adminUpcomingEvents">
          <!-- Generado dinámicamente por AdminDashboard.js -->
        </div>

      </div>
    `;

    // Re-inicializar dashboard
    if (typeof AdminDashboard !== 'undefined') {
      AdminDashboard.init();
    }
  },

  /**
   * Renderiza la vista de Gestión de Usuarios
   */
  renderUsersView() {
    this.viewContainer.innerHTML = `
      <section class="admin-section">
        <div class="admin-section__header" style="display: flex; justify-content: space-between; align-items: center;">
          <h2 class="admin-section__title">Gestión de Usuarios</h2>
          <div style="display: flex; gap: 8px;">
            <button class="admin-button admin-button--outline" onclick="AdminUsers.exportToCSV()">
              Exportar CSV
            </button>
            <button class="admin-button admin-button--primary" onclick="AdminUsers.createUser()">
              + Nuevo Usuario
            </button>
          </div>
        </div>
      </section>

      <!-- Estadísticas -->
      <section class="admin-card mb-3">
        <div class="admin-card__body">
          <div id="usersStats"></div>
        </div>
      </section>

      <!-- Filtros y búsqueda -->
      <section class="admin-card mb-3">
        <div class="admin-card__body">
          <div class="admin-grid admin-grid--cols-4">
            <div class="admin-form-group">
              <label class="admin-form-label">Buscar usuario</label>
              <input type="text" id="userSearchInput" class="admin-form-input" placeholder="Nombre, email...">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Tipo de usuario</label>
              <select id="userTypeFilter" class="admin-form-select">
                <option value="all">Todos</option>
                <option value="Estudiante">Estudiantes</option>
                <option value="Empresa">Empresas</option>
                <option value="Administrador">Administradores</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Estado</label>
              <select id="userStatusFilter" class="admin-form-select">
                <option value="all">Todos</option>
                <option value="Activo">Activos</option>
                <option value="Inactivo">Inactivos</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Tabla de usuarios -->
      <section class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Lista de Usuarios</h3>
        </div>
        <div class="admin-card__body">
          <table class="admin-table">
            <thead class="admin-table__header">
              <tr>
                <th class="admin-table__header-cell">ID</th>
                <th class="admin-table__header-cell">Nombre</th>
                <th class="admin-table__header-cell">Email</th>
                <th class="admin-table__header-cell">Tipo</th>
                <th class="admin-table__header-cell">Estado</th>
                <th class="admin-table__header-cell">Último acceso</th>
                <th class="admin-table__header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody id="usersTableBody">
              <!-- Generado dinámicamente por AdminUsers.js -->
            </tbody>
          </table>
        </div>
        <div class="admin-card__footer">
          <div id="usersPagination"></div>
        </div>
      </section>
    `;

    // Inicializar módulo de usuarios
    if (typeof AdminUsers !== 'undefined') {
      AdminUsers.init();
    }
  },

  /**
   * Renderiza la vista de Supervisión de Ofertas
   */
  renderOffersView() {
    this.viewContainer.innerHTML = `
      <section class="admin-section">
        <div class="admin-section__header" style="display: flex; justify-content: space-between; align-items: center;">
          <h2 class="admin-section__title">Supervisión de Ofertas</h2>
          <button class="admin-button admin-button--outline" onclick="AdminOffers.exportToCSV()">
            Exportar CSV
          </button>
        </div>
      </section>

      <!-- Estadísticas de ofertas -->
      <section class="admin-card mb-3">
        <div class="admin-card__body">
          <div id="offersStats"></div>
        </div>
      </section>

      <!-- Filtros y búsqueda -->
      <section class="admin-card mb-3">
        <div class="admin-card__body">
          <div class="admin-grid admin-grid--cols-3">
            <div class="admin-form-group">
              <label class="admin-form-label">Buscar oferta</label>
              <input type="text" id="offerSearchInput" class="admin-form-input" placeholder="Título, empresa...">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Estado</label>
              <select id="offerStatusFilter" class="admin-form-select">
                <option value="all">Todos</option>
                <option value="Pendiente">Pendientes</option>
                <option value="Aprobada">Aprobadas</option>
                <option value="Rechazada">Rechazadas</option>
                <option value="Cerrada">Cerradas</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Tabla de ofertas -->
      <section class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Lista de Ofertas</h3>
        </div>
        <div class="admin-card__body">
          <table class="admin-table">
            <thead class="admin-table__header">
              <tr>
                <th class="admin-table__header-cell">ID</th>
                <th class="admin-table__header-cell">Título / Empresa</th>
                <th class="admin-table__header-cell">Estado</th>
                <th class="admin-table__header-cell">Postulaciones</th>
                <th class="admin-table__header-cell">Fecha</th>
                <th class="admin-table__header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody id="offersTableBody">
              <!-- Generado dinámicamente por AdminOffers.js -->
            </tbody>
          </table>
        </div>
        <div class="admin-card__footer">
          <div id="offersPagination"></div>
        </div>
      </section>
    `;

    // Inicializar módulo de ofertas
    if (typeof AdminOffers !== 'undefined') {
      AdminOffers.init();
    }
  },

  /**
   * Renderiza la vista de Reportes
   */
  renderReportsView() {
    this.viewContainer.innerHTML = `
      <section class="admin-section">
        <div class="admin-section__header">
          <h2 class="admin-section__title">Reportes</h2>
        </div>
      </section>

      <!-- Reportes rápidos -->
      <section class="admin-card mb-3">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Reportes Rápidos</h3>
        </div>
        <div class="admin-card__body">
          <div class="admin-grid admin-grid--cols-4">
            <button class="admin-button admin-button--outline admin-button--full" onclick="AdminReports.generateQuickReport('activity')">
              Actividad del Mes
            </button>
            <button class="admin-button admin-button--outline admin-button--full" onclick="AdminReports.generateQuickReport('offers')">
              Ofertas del Mes
            </button>
            <button class="admin-button admin-button--outline admin-button--full" onclick="AdminReports.generateQuickReport('applications')">
              Postulaciones del Mes
            </button>
            <button class="admin-button admin-button--outline admin-button--full" onclick="AdminReports.generateQuickReport('users')">
              Usuarios del Mes
            </button>
          </div>
        </div>
      </section>

      <!-- Generador de reportes -->
      <section class="admin-card mb-3">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Generar Reporte Personalizado</h3>
        </div>
        <div class="admin-card__body">
          <form id="generateReportForm">
            <div class="admin-grid admin-grid--cols-4">
              <div class="admin-form-group">
                <label class="admin-form-label">Tipo de reporte</label>
                <select class="admin-form-select" name="reportType" required>
                  <option value="activity">Actividad de usuarios</option>
                  <option value="offers">Ofertas publicadas</option>
                  <option value="applications">Postulaciones</option>
                  <option value="users">Usuarios registrados</option>
                  <option value="companies">Empresas registradas</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Fecha inicio</label>
                <input type="date" class="admin-form-input" name="startDate" required>
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Fecha fin</label>
                <input type="date" class="admin-form-input" name="endDate" required>
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Formato</label>
                <select class="admin-form-select" name="format">
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>
            </div>
            <button type="submit" class="admin-button admin-button--primary mt-2">
              Generar Reporte
            </button>
          </form>
        </div>
      </section>

      <!-- Reportes recientes -->
      <section class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Reportes Generados</h3>
        </div>
        <div class="admin-card__body">
          <div id="reportsList">
            <!-- Generado dinámicamente por AdminReports.js -->
          </div>
        </div>
      </section>
    `;

    // Inicializar módulo de reportes
    if (typeof AdminReports !== 'undefined') {
      AdminReports.init();
    }
  },

  /**
   * Genera filas mock para la tabla de usuarios
   */
  generateMockUserRows() {
    const users = [
      { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com', type: 'Estudiante', status: 'Activo' },
      { id: 2, name: 'María García', email: 'maria.garcia@example.com', type: 'Estudiante', status: 'Activo' },
      { id: 3, name: 'Empresa XYZ', email: 'contacto@xyz.com', type: 'Empresa', status: 'Activo' },
      { id: 4, name: 'Carlos López', email: 'carlos.lopez@example.com', type: 'Estudiante', status: 'Inactivo' },
      { id: 5, name: 'Tech Solutions', email: 'info@techsol.com', type: 'Empresa', status: 'Activo' },
    ];

    return users.map(user => `
      <tr class="admin-table__row">
        <td class="admin-table__cell">${user.id}</td>
        <td class="admin-table__cell">${user.name}</td>
        <td class="admin-table__cell">${user.email}</td>
        <td class="admin-table__cell">
          <span class="admin-badge admin-badge--${user.type === 'Estudiante' ? 'info' : 'primary'}">
            ${user.type}
          </span>
        </td>
        <td class="admin-table__cell">
          <span class="admin-badge admin-badge--${user.status === 'Activo' ? 'success' : 'error'}">
            ${user.status}
          </span>
        </td>
        <td class="admin-table__cell">
          <button class="admin-button admin-button--sm admin-button--ghost">Ver</button>
          <button class="admin-button admin-button--sm admin-button--ghost">Editar</button>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Genera filas mock para la tabla de ofertas
   */
  generateMockOfferRows() {
    const offers = [
      { id: 1, title: 'Desarrollador Web Frontend', company: 'Empresa XYZ', date: '2025-10-05', status: 'Pendiente' },
      { id: 2, title: 'Diseñador UI/UX', company: 'Tech Solutions', date: '2025-10-04', status: 'Pendiente' },
      { id: 3, title: 'Analista de Datos', company: 'Data Corp', date: '2025-10-03', status: 'Pendiente' },
    ];

    return offers.map(offer => `
      <tr class="admin-table__row">
        <td class="admin-table__cell">${offer.id}</td>
        <td class="admin-table__cell">${offer.title}</td>
        <td class="admin-table__cell">${offer.company}</td>
        <td class="admin-table__cell">${offer.date}</td>
        <td class="admin-table__cell">
          <span class="admin-badge admin-badge--warning">${offer.status}</span>
        </td>
        <td class="admin-table__cell">
          <button class="admin-button admin-button--sm admin-button--primary">Aprobar</button>
          <button class="admin-button admin-button--sm admin-button--outline">Rechazar</button>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Genera items mock para reportes
   */
  generateMockReportItems() {
    const reports = [
      { name: 'Reporte de Actividad Semanal', date: 'Hace 2 días', type: 'PDF' },
      { name: 'Ofertas Publicadas - Octubre', date: 'Hace 5 días', type: 'Excel' },
      { name: 'Usuarios Registrados - Septiembre', date: 'Hace 1 semana', type: 'PDF' },
    ];

    return reports.map(report => `
      <li class="admin-list__item">
        <div class="admin-list__item-primary">
          ${report.name}
          <span class="admin-badge admin-badge--info ml-2">${report.type}</span>
        </div>
        <div class="admin-list__item-secondary">${report.date}</div>
      </li>
    `).join('');
  },
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AdminRouter.init());
} else {
  AdminRouter.init();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminRouter;
}
