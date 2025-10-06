/**
 * CompanyDashboard.js
 * Lógica específica del Dashboard: renderizar estadísticas, actividad reciente, acciones rápidas
 */

const CompanyDashboard = {
  /**
   * Inicializa el dashboard
   */
  init() {
    this.renderSummaryCards();
    this.renderRecentActivity();
    this.renderQuickActions();
    console.log('CompanyDashboard inicializado');
  },

  /**
   * Renderiza las tarjetas de resumen (estadísticas principales)
   */
  renderSummaryCards() {
    const container = document.getElementById('companySummaryCards');
    if (!container) return;

    const stats = CompanyConfig.mockData.dashboardStats;
    
    const cards = [
      {
        title: 'Ofertas Activas',
        value: CompanyConfig.formatters.formatNumber(stats.activeOffers),
        icon: this.getIconSVG('work'),
        colorClass: 'primary',
      },
      {
        title: 'Borradores',
        value: CompanyConfig.formatters.formatNumber(stats.drafts),
        icon: this.getIconSVG('draft'),
        colorClass: 'secondary',
      },
      {
        title: 'Nuevas Postulaciones',
        value: CompanyConfig.formatters.formatNumber(stats.newApplications),
        icon: this.getIconSVG('people'),
        colorClass: 'success',
      },
    ];

    container.innerHTML = cards.map(card => `
      <div class="company-card">
        <div class="company-card__header">
          <div class="company-card__icon company-card__icon--${card.colorClass}">
            ${card.icon}
          </div>
          <h3 class="company-card__title">${card.title}</h3>
        </div>
        <div class="company-card__body">
          <div class="company-card__value">${card.value}</div>
        </div>
      </div>
    `).join('');

    // TODO: Reemplazar con llamada real a la API cuando Django esté listo
    // this.fetchDashboardStats();
  },

  /**
   * Renderiza la lista de actividad reciente
   */
  renderRecentActivity() {
    const container = document.getElementById('companyRecentActivity');
    if (!container) return;

    const activities = CompanyConfig.mockData.recentActivity;

    container.innerHTML = `
      <ul class="company-list">
        ${activities.map(activity => `
          <li class="company-list__item">
            <div class="company-list__item-primary">${activity.description}</div>
            <div class="company-list__item-secondary">${activity.time}</div>
          </li>
        `).join('')}
      </ul>
    `;

    // TODO: Reemplazar con llamada real a la API cuando Django esté listo
    // this.fetchRecentActivity();
  },

  /**
   * Renderiza las acciones rápidas
   */
  renderQuickActions() {
    const container = document.getElementById('companyQuickActions');
    if (!container) return;

    const actions = CompanyConfig.mockData.quickActions;

    container.innerHTML = actions.map(action => `
      <button 
        class="company-button company-button--primary company-button--lg company-button--full"
        onclick="CompanyDashboard.handleQuickAction('${action.route}')"
      >
        <div class="company-button__icon">
          ${this.getIconSVG(action.icon)}
        </div>
        <div>
          <div style="font-weight: 600;">${action.title}</div>
          <div style="font-size: 0.75rem; margin-top: 4px; opacity: 0.9;">
            ${action.description}
          </div>
        </div>
      </button>
    `).join('');
  },

  /**
   * Maneja el click en una acción rápida
   * @param {string} route - Ruta a navegar
   */
  handleQuickAction(route) {
    if (typeof CompanyRouter !== 'undefined') {
      CompanyRouter.navigate(route);
    } else {
      console.log('Navegando a:', route);
      CompanyUI.showToast(`Navegando a ${route}`, 'info');
    }
  },

  /**
   * Obtiene el SVG de un icono según su nombre
   * @param {string} iconName - Nombre del icono
   * @returns {string} SVG del icono
   */
  getIconSVG(iconName) {
    const icons = {
      people: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      `,
      work: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
        </svg>
      `,
      school: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        </svg>
      `,
      assessment: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      `,
      settings: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      `,
    };

    return icons[iconName] || icons.assessment;
  },

  /**
   * Obtiene estadísticas del dashboard desde la API
   * TODO: Implementar cuando el backend Django esté listo
   */
  async fetchDashboardStats() {
    try {
      CompanyUI.showLoader(true);
      
      // const data = await apiRequest(CompanyConfig.api.endpoints.dashboardStats);
      // CompanyConfig.mockData.dashboardStats = data;
      // this.renderSummaryCards();
      
      CompanyUI.showLoader(false);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      CompanyUI.showToast(CompanyConfig.messages.errors.network, 'error');
      CompanyUI.showLoader(false);
    }
  },

  /**
   * Obtiene actividad reciente desde la API
   * TODO: Implementar cuando el backend Django esté listo
   */
  async fetchRecentActivity() {
    try {
      // const data = await apiRequest(CompanyConfig.api.endpoints.recentActivity);
      // CompanyConfig.mockData.recentActivity = data;
      // this.renderRecentActivity();
    } catch (error) {
      console.error('Error al obtener actividad reciente:', error);
      CompanyUI.showToast(CompanyConfig.messages.errors.network, 'error');
    }
  },

  /**
   * Refresca todos los datos del dashboard
   */
  async refresh() {
    CompanyUI.showToast('Actualizando dashboard...', 'info', 1500);
    
    // TODO: Descomentar cuando la API esté lista
    // await Promise.all([
    //   this.fetchDashboardStats(),
    //   this.fetchRecentActivity(),
    // ]);
    
    // Por ahora solo re-renderizamos con datos mock
    this.renderSummaryCards();
    this.renderRecentActivity();
    this.renderQuickActions();
    
    CompanyUI.showToast('Dashboard actualizado', 'success');
  },
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CompanyDashboard.init());
} else {
  CompanyDashboard.init();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompanyDashboard;
}
