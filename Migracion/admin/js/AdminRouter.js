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
        <div class="admin-section__header">
          <h2 class="admin-section__title">Panel de Administración</h2>
        </div>
      </section>

      <!-- Resumen General -->
      <section class="admin-section">
        <h3 class="admin-section__subtitle">Resumen General</h3>
        
        <!-- Cards de estadísticas -->
        <div id="adminSummaryCards" class="admin-grid admin-grid--cols-3">
          <!-- Generado dinámicamente por AdminDashboard.js -->
        </div>
      </section>

      <!-- Actividad Reciente y Acciones Rápidas -->
      <div class="admin-grid admin-grid--cols-2">
        
        <!-- Actividad Reciente -->
        <section class="admin-card">
          <div class="admin-card__header">
            <h3 class="admin-card__title">Actividad Reciente</h3>
          </div>
          <div class="admin-card__body">
            <div id="adminRecentActivity">
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
            <div id="adminQuickActions" class="admin-grid admin-grid--cols-2">
              <!-- Generado dinámicamente por AdminDashboard.js -->
            </div>
          </div>
        </section>

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
        <div class="admin-section__header">
          <h2 class="admin-section__title">Gestión de Usuarios</h2>
        </div>
      </section>

      <!-- Filtros y búsqueda -->
      <section class="admin-card mb-3">
        <div class="admin-card__body">
          <div class="admin-grid admin-grid--cols-4">
            <div class="admin-form-group">
              <label class="admin-form-label">Buscar usuario</label>
              <input type="text" class="admin-form-input" placeholder="Nombre, email...">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Tipo de usuario</label>
              <select class="admin-form-select">
                <option>Todos</option>
                <option>Estudiantes</option>
                <option>Empresas</option>
                <option>Administradores</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Estado</label>
              <select class="admin-form-select">
                <option>Todos</option>
                <option>Activos</option>
                <option>Inactivos</option>
              </select>
            </div>
            <div class="admin-form-group" style="display: flex; align-items: flex-end;">
              <button class="admin-button admin-button--primary admin-button--full">
                Buscar
              </button>
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
                <th class="admin-table__header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${this.generateMockUserRows()}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  /**
   * Renderiza la vista de Supervisión de Ofertas
   */
  renderOffersView() {
    this.viewContainer.innerHTML = `
      <section class="admin-section">
        <div class="admin-section__header">
          <h2 class="admin-section__title">Supervisión de Ofertas</h2>
        </div>
      </section>

      <!-- Estadísticas de ofertas -->
      <section class="admin-section">
        <div class="admin-grid admin-grid--cols-4">
          <div class="admin-card">
            <div class="admin-card__body">
              <div class="admin-card__value">32</div>
              <div class="admin-card__label">Pendientes de Aprobación</div>
            </div>
          </div>
          <div class="admin-card">
            <div class="admin-card__body">
              <div class="admin-card__value">156</div>
              <div class="admin-card__label">Ofertas Activas</div>
            </div>
          </div>
          <div class="admin-card">
            <div class="admin-card__body">
              <div class="admin-card__value">89</div>
              <div class="admin-card__label">Ofertas Cerradas</div>
            </div>
          </div>
          <div class="admin-card">
            <div class="admin-card__body">
              <div class="admin-card__value">12</div>
              <div class="admin-card__label">Rechazadas</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tabla de ofertas -->
      <section class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Ofertas Pendientes de Aprobación</h3>
        </div>
        <div class="admin-card__body">
          <table class="admin-table">
            <thead class="admin-table__header">
              <tr>
                <th class="admin-table__header-cell">ID</th>
                <th class="admin-table__header-cell">Título</th>
                <th class="admin-table__header-cell">Empresa</th>
                <th class="admin-table__header-cell">Fecha</th>
                <th class="admin-table__header-cell">Estado</th>
                <th class="admin-table__header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${this.generateMockOfferRows()}
            </tbody>
          </table>
        </div>
      </section>
    `;
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

      <!-- Generador de reportes -->
      <section class="admin-card mb-3">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Generar Nuevo Reporte</h3>
        </div>
        <div class="admin-card__body">
          <div class="admin-grid admin-grid--cols-3">
            <div class="admin-form-group">
              <label class="admin-form-label">Tipo de reporte</label>
              <select class="admin-form-select">
                <option>Actividad de usuarios</option>
                <option>Ofertas publicadas</option>
                <option>Postulaciones</option>
                <option>Empresas registradas</option>
              </select>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Fecha inicio</label>
              <input type="date" class="admin-form-input">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Fecha fin</label>
              <input type="date" class="admin-form-input">
            </div>
          </div>
          <button class="admin-button admin-button--primary mt-2">
            Generar Reporte
          </button>
        </div>
      </section>

      <!-- Reportes recientes -->
      <section class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Reportes Generados Recientemente</h3>
        </div>
        <div class="admin-card__body">
          <ul class="admin-list">
            ${this.generateMockReportItems()}
          </ul>
        </div>
      </section>
    `;
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
