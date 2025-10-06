/**
 * CompanyRouter.js
 * Sistema de enrutamiento SPA (Single Page Application)
 * Maneja la navegación entre vistas sin recargar la página
 */

const CompanyRouter = {
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
    this.viewContainer = document.getElementById('companyViewContainer');
    
    if (!this.viewContainer) {
      console.error('No se encontró el contenedor de vistas #companyViewContainer');
      return;
    }

    // Cargar vista inicial (dashboard)
    this.navigate('/');
    
    // Manejar navegación con botones del navegador (back/forward)
    window.addEventListener('popstate', (e) => {
      const route = e.state?.route || '/';
      this.navigate(route, false);
    });

    console.log('CompanyRouter inicializado');
  },

  /**
   * Navega a una ruta específica
   * @param {string} route - Ruta a navegar (ej: '/', '/ofertas', '/postulantes')
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
      '/ofertas': 'offers',
      '/ofertas/nueva': 'newOffer',
      '/postulantes': 'applicants',
    };

    return routeMap[route] || 'dashboard';
  },

  /**
   * Actualiza el item activo del menú
   * @param {string} route - Ruta activa
   */
  updateActiveMenuItem(route) {
    const menuItems = document.querySelectorAll('.company-sidebar__menu-item');
    
    menuItems.forEach(item => {
      const itemRoute = item.dataset.route;
      
      if (itemRoute === route) {
        item.classList.add('company-sidebar__menu-item--active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('company-sidebar__menu-item--active');
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
      offers: this.renderOffersView,
      newOffer: this.renderNewOfferView,
      applicants: this.renderApplicantsView,
    };

    const renderFunction = views[viewName] || views.dashboard;
    
    // Limpiar contenedor
    this.viewContainer.innerHTML = '';
    
    // Renderizar nueva vista
    renderFunction.call(this);

    // Re-inicializar animaciones
    if (typeof CompanyUI !== 'undefined') {
      CompanyUI.initAnimations();
    }
  },

  /**
   * Renderiza la vista del Dashboard
   */
  renderDashboardView() {
    this.viewContainer.innerHTML = `
      <!-- Título de página -->
      <section class="company-section">
        <div class="company-section__header">
          <h2 class="company-section__title">Panel de Empresa</h2>
        </div>
      </section>

      <!-- Resumen General -->
      <section class="company-section">
        <h3 class="company-section__subtitle">Resumen General</h3>
        
        <!-- Cards de estadísticas -->
        <div id="companySummaryCards" class="company-grid company-grid--cols-3">
          <!-- Generado dinámicamente por CompanyDashboard.js -->
        </div>
      </section>

      <!-- Actividad Reciente y Acciones Rápidas -->
      <div class="company-grid company-grid--cols-2">
        
        <!-- Actividad Reciente -->
        <section class="company-card">
          <div class="company-card__header">
            <h3 class="company-card__title">Actividad Reciente</h3>
          </div>
          <div class="company-card__body">
            <div id="companyRecentActivity">
              <!-- Generado dinámicamente por CompanyDashboard.js -->
            </div>
          </div>
        </section>

        <!-- Acciones Rápidas -->
        <section class="company-card">
          <div class="company-card__header">
            <h3 class="company-card__title">Acciones Rápidas</h3>
          </div>
          <div class="company-card__body">
            <div id="companyQuickActions" class="company-grid company-grid--cols-2">
              <!-- Generado dinámicamente por CompanyDashboard.js -->
            </div>
          </div>
        </section>

      </div>
    `;

    // Re-inicializar dashboard
    if (typeof CompanyDashboard !== 'undefined') {
      CompanyDashboard.init();
    }
  },

  /**
   * Renderiza la vista de Mis Ofertas
   */
  renderOffersView() {
    this.viewContainer.innerHTML = `
      <section class="company-section">
        <div class="company-section__header">
          <h2 class="company-section__title">Mis Ofertas</h2>
        </div>
      </section>

      <!-- Botón crear nueva oferta -->
      <section class="mb-3">
        <button class="company-button company-button--primary" onclick="CompanyRouter.navigate('/ofertas/nueva')">
          + Crear Nueva Oferta
        </button>
      </section>

      <!-- Estadísticas de ofertas -->
      <section class="company-section">
        <div class="company-grid company-grid--cols-4">
          <div class="company-card">
            <div class="company-card__body">
              <div class="company-card__value">3</div>
              <div class="company-card__label">Ofertas Activas</div>
            </div>
          </div>
          <div class="company-card">
            <div class="company-card__body">
              <div class="company-card__value">2</div>
              <div class="company-card__label">Borradores</div>
            </div>
          </div>
          <div class="company-card">
            <div class="company-card__body">
              <div class="company-card__value">12</div>
              <div class="company-card__label">Total Postulantes</div>
            </div>
          </div>
          <div class="company-card">
            <div class="company-card__body">
              <div class="company-card__value">8</div>
              <div class="company-card__label">Ofertas Cerradas</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tabla de ofertas -->
      <section class="company-card">
        <div class="company-card__header">
          <h3 class="company-card__title">Todas las Ofertas</h3>
        </div>
        <div class="company-card__body">
          <table class="company-table">
            <thead class="company-table__header">
              <tr>
                <th class="company-table__header-cell">Título</th>
                <th class="company-table__header-cell">Estado</th>
                <th class="company-table__header-cell">Postulantes</th>
                <th class="company-table__header-cell">Fecha Publicación</th>
                <th class="company-table__header-cell">Acciones</th>
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
   * Renderiza la vista de Nueva Oferta
   */
  renderNewOfferView() {
    this.viewContainer.innerHTML = `
      <section class="company-section">
        <div class="company-section__header">
          <h2 class="company-section__title">Crear Nueva Oferta</h2>
        </div>
      </section>

      <section class="company-card">
        <div class="company-card__body">
          <form>
            <div class="company-grid company-grid--cols-2">
              <div class="company-form-group">
                <label class="company-form-label">Título de la oferta *</label>
                <input type="text" class="company-form-input" placeholder="Ej: Desarrollador Web Frontend">
              </div>
              
              <div class="company-form-group">
                <label class="company-form-label">Área *</label>
                <select class="company-form-select">
                  <option>Tecnología</option>
                  <option>Diseño</option>
                  <option>Marketing</option>
                  <option>Administración</option>
                </select>
              </div>
            </div>

            <div class="company-form-group">
              <label class="company-form-label">Descripción *</label>
              <textarea class="company-form-textarea" rows="5" placeholder="Describe las responsabilidades y requisitos..."></textarea>
            </div>

            <div class="company-grid company-grid--cols-3">
              <div class="company-form-group">
                <label class="company-form-label">Duración (meses) *</label>
                <input type="number" class="company-form-input" placeholder="6">
              </div>
              
              <div class="company-form-group">
                <label class="company-form-label">Modalidad *</label>
                <select class="company-form-select">
                  <option>Presencial</option>
                  <option>Remoto</option>
                  <option>Híbrido</option>
                </select>
              </div>

              <div class="company-form-group">
                <label class="company-form-label">Vacantes *</label>
                <input type="number" class="company-form-input" placeholder="1">
              </div>
            </div>

            <div class="company-form-group">
              <label class="company-form-label">Requisitos</label>
              <textarea class="company-form-textarea" rows="3" placeholder="Conocimientos, habilidades, experiencia..."></textarea>
            </div>

            <div style="display: flex; gap: 16px; margin-top: 24px;">
              <button type="button" class="company-button company-button--primary">Publicar Oferta</button>
              <button type="button" class="company-button company-button--outline">Guardar como Borrador</button>
              <button type="button" class="company-button company-button--ghost" onclick="CompanyRouter.navigate('/ofertas')">Cancelar</button>
            </div>
          </form>
        </div>
      </section>
    `;
  },

  /**
   * Renderiza la vista de Postulantes
   */
  renderApplicantsView() {
    this.viewContainer.innerHTML = `
      <section class="company-section">
        <div class="company-section__header">
          <h2 class="company-section__title">Postulantes</h2>
        </div>
      </section>

      <!-- Filtros -->
      <section class="company-card mb-3">
        <div class="company-card__body">
          <div class="company-grid company-grid--cols-3">
            <div class="company-form-group">
              <label class="company-form-label">Filtrar por oferta</label>
              <select class="company-form-select">
                <option>Todas las ofertas</option>
                <option>Desarrollador Web Frontend</option>
                <option>Diseñador UI/UX</option>
                <option>Analista de Datos</option>
              </select>
            </div>
            <div class="company-form-group">
              <label class="company-form-label">Estado</label>
              <select class="company-form-select">
                <option>Todos</option>
                <option>Nuevos</option>
                <option>En revisión</option>
                <option>Aceptados</option>
                <option>Rechazados</option>
              </select>
            </div>
            <div class="company-form-group" style="display: flex; align-items: flex-end;">
              <button class="company-button company-button--primary company-button--full">Buscar</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Tabla de postulantes -->
      <section class="company-card">
        <div class="company-card__header">
          <h3 class="company-card__title">Lista de Postulantes</h3>
        </div>
        <div class="company-card__body">
          <table class="company-table">
            <thead class="company-table__header">
              <tr>
                <th class="company-table__header-cell">Nombre</th>
                <th class="company-table__header-cell">Oferta</th>
                <th class="company-table__header-cell">Fecha Postulación</th>
                <th class="company-table__header-cell">Estado</th>
                <th class="company-table__header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${this.generateMockApplicantRows()}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  /**
   * Genera filas mock para la tabla de ofertas
   */
  generateMockOfferRows() {
    const offers = [
      { title: 'Desarrollador Web Frontend', status: 'Activa', applicants: 5, date: '2025-10-01' },
      { title: 'Diseñador UI/UX', status: 'Activa', applicants: 3, date: '2025-09-28' },
      { title: 'Analista de Datos', status: 'Borrador', applicants: 0, date: '-' },
      { title: 'Desarrollador Backend', status: 'Cerrada', applicants: 4, date: '2025-09-15' },
    ];

    return offers.map(offer => `
      <tr class="company-table__row">
        <td class="company-table__cell">${offer.title}</td>
        <td class="company-table__cell">
          <span class="company-badge company-badge--${offer.status === 'Activa' ? 'success' : offer.status === 'Borrador' ? 'warning' : 'error'}">
            ${offer.status}
          </span>
        </td>
        <td class="company-table__cell">${offer.applicants}</td>
        <td class="company-table__cell">${offer.date}</td>
        <td class="company-table__cell">
          <button class="company-button company-button--sm company-button--ghost">Ver</button>
          <button class="company-button company-button--sm company-button--ghost">Editar</button>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Genera filas mock para la tabla de postulantes
   */
  generateMockApplicantRows() {
    const applicants = [
      { name: 'Juan Pérez', offer: 'Desarrollador Web Frontend', date: '2025-10-05', status: 'Nuevo' },
      { name: 'María García', offer: 'Diseñador UI/UX', date: '2025-10-04', status: 'En revisión' },
      { name: 'Carlos López', offer: 'Desarrollador Web Frontend', date: '2025-10-03', status: 'Nuevo' },
      { name: 'Ana Martínez', offer: 'Diseñador UI/UX', date: '2025-10-02', status: 'Aceptado' },
    ];

    return applicants.map(applicant => `
      <tr class="company-table__row">
        <td class="company-table__cell">${applicant.name}</td>
        <td class="company-table__cell">${applicant.offer}</td>
        <td class="company-table__cell">${applicant.date}</td>
        <td class="company-table__cell">
          <span class="company-badge company-badge--${applicant.status === 'Nuevo' ? 'info' : applicant.status === 'En revisión' ? 'warning' : 'success'}">
            ${applicant.status}
          </span>
        </td>
        <td class="company-table__cell">
          <button class="company-button company-button--sm company-button--primary">Ver Perfil</button>
          <button class="company-button company-button--sm company-button--outline">Contactar</button>
        </td>
      </tr>
    `).join('');
  },
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CompanyRouter.init());
} else {
  CompanyRouter.init();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompanyRouter;
}
