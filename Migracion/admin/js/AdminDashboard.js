/**
 * AdminDashboard.js
 * Lógica específica del Dashboard: renderizar estadísticas, actividad reciente, acciones rápidas
 */

const AdminDashboard = {
  /**
   * Inicializa el dashboard
   */
  init() {
    this.renderSummaryCards();
    this.renderAlerts();
    this.renderQuickActions();
    this.renderCharts();
    this.renderUpcomingEvents();
    console.log('AdminDashboard inicializado');
  },

  /**
   * Renderiza las tarjetas de resumen (estadísticas principales) mejoradas
   */
  renderSummaryCards() {
    const container = document.getElementById('adminSummaryCards');
    if (!container) return;

    const stats = AdminConfig.mockData.dashboardStats;
    
    const cards = [
      {
        title: 'Total Usuarios',
        value: AdminConfig.formatters.formatNumber(stats.totalUsers),
        icon: this.getIconSVG('people'),
        colorClass: 'primary',
        trend: '+12%',
        trendUp: true,
        subtitle: 'vs. mes anterior',
      },
      {
        title: 'Ofertas Pendientes',
        value: AdminConfig.formatters.formatNumber(stats.pendingOffers),
        icon: this.getIconSVG('work'),
        colorClass: 'warning',
        trend: '+5',
        trendUp: true,
        subtitle: 'nuevas hoy',
      },
      {
        title: 'Prácticas Activas',
        value: AdminConfig.formatters.formatNumber(stats.activeInternships),
        icon: this.getIconSVG('school'),
        colorClass: 'success',
        trend: '+8%',
        trendUp: true,
        subtitle: 'vs. mes anterior',
      },
      {
        title: 'Empresas Activas',
        value: AdminConfig.formatters.formatNumber(156),
        icon: this.getIconSVG('business'),
        colorClass: 'info',
        trend: '+3%',
        trendUp: true,
        subtitle: 'publicando ofertas',
      },
    ];

    container.innerHTML = cards.map(card => `
      <div class="admin-card" style="position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; opacity: 0.1; transform: translate(20px, -20px);">
          ${card.icon}
        </div>
        <div style="position: relative; z-index: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div class="admin-card__icon admin-card__icon--${card.colorClass}" style="width: 48px; height: 48px;">
              ${card.icon}
            </div>
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 4px 8px;
              border-radius: 12px;
              background: ${card.trendUp ? '#4caf5015' : '#f4433615'};
              color: ${card.trendUp ? '#4caf50' : '#f44336'};
              font-size: 0.875rem;
              font-weight: 600;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="${card.trendUp ? 'M7 14l5-5 5 5z' : 'M7 10l5 5 5-5z'}"/>
              </svg>
              ${card.trend}
            </div>
          </div>
          <h3 style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 8px; font-weight: 500;">
            ${card.title}
          </h3>
          <div style="font-size: 2rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 4px;">
            ${card.value}
          </div>
          <div style="font-size: 0.75rem; color: var(--color-text-secondary);">
            ${card.subtitle}
          </div>
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
    const container = document.getElementById('adminRecentActivity');
    if (!container) return;

    const activities = AdminConfig.mockData.recentActivity;

    container.innerHTML = `
      <ul class="admin-list">
        ${activities.map(activity => `
          <li class="admin-list__item">
            <div class="admin-list__item-primary">${activity.description}</div>
            <div class="admin-list__item-secondary">${activity.time}</div>
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
    const container = document.getElementById('adminQuickActions');
    if (!container) return;

    const actions = AdminConfig.mockData.quickActions;

    container.innerHTML = actions.map(action => `
      <button 
        class="admin-button admin-button--primary admin-button--full"
        onclick="AdminDashboard.handleQuickAction('${action.route}')"
        style="
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          text-align: left;
          transition: all 0.2s ease;
        "
        onmouseover="this.style.transform='translateX(4px)'; this.style.boxShadow='0 4px 12px rgba(0,62,126,0.3)';"
        onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='';"
      >
        <div style="
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
        ">
          ${this.getIconSVG(action.icon)}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 0.9375rem;">${action.title}</div>
          <div style="font-size: 0.75rem; margin-top: 2px; opacity: 0.9;">
            ${action.description}
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="opacity: 0.7;">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
        </svg>
      </button>
    `).join('');
  },

  /**
   * Maneja el click en una acción rápida
   * @param {string} route - Ruta a navegar
   */
  handleQuickAction(route) {
    if (typeof AdminRouter !== 'undefined') {
      AdminRouter.navigate(route);
    } else {
      console.log('Navegando a:', route);
      AdminUI.showToast(`Navegando a ${route}`, 'info');
    }
  },

  /**
   * Renderiza gráficos de tendencias
   */
  renderCharts() {
    const container = document.getElementById('adminCharts');
    if (!container) return;

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Tendencias del Último Mes</h3>
        </div>
        <div class="admin-card__body">
          ${this.renderSimpleChart()}
        </div>
      </div>
    `;
  },

  /**
   * Renderiza un gráfico simple con barras ASCII
   */
  renderSimpleChart() {
    const data = [
      { label: 'Sem 1', users: 45, offers: 12, applications: 28 },
      { label: 'Sem 2', users: 52, offers: 15, applications: 35 },
      { label: 'Sem 3', users: 48, offers: 18, applications: 42 },
      { label: 'Sem 4', users: 61, offers: 22, applications: 51 },
    ];

    const maxValue = Math.max(...data.flatMap(d => [d.users, d.offers, d.applications]));

    return `
      <div style="display: grid; gap: 24px;">
        ${data.map(week => `
          <div>
            <div style="font-size: 0.875rem; font-weight: 600; margin-bottom: 12px; color: var(--color-text-primary);">
              ${week.label}
            </div>
            <div style="display: grid; gap: 8px;">
              ${this.renderChartBar('Usuarios', week.users, maxValue, '#003e7e')}
              ${this.renderChartBar('Ofertas', week.offers, maxValue, '#ff9800')}
              ${this.renderChartBar('Postulaciones', week.applications, maxValue, '#4caf50')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * Renderiza una barra del gráfico
   */
  renderChartBar(label, value, maxValue, color) {
    const percentage = (value / maxValue) * 100;
    return `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 100px; font-size: 0.75rem; color: var(--color-text-secondary);">
          ${label}
        </div>
        <div style="flex: 1; height: 24px; background: #f5f5f5; border-radius: 12px; overflow: hidden; position: relative;">
          <div style="
            height: 100%;
            width: ${percentage}%;
            background: ${color};
            border-radius: 12px;
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 8px;
          ">
            <span style="font-size: 0.75rem; font-weight: 600; color: white;">
              ${value}
            </span>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Renderiza top empresas
   */
  renderTopCompanies() {
    const container = document.getElementById('adminTopCompanies');
    if (!container) return;

    const companies = [
      { name: 'TechCorp S.A.', offers: 15, logo: '🏢' },
      { name: 'Innovatech', offers: 12, logo: '💼' },
      { name: 'Digital Solutions', offers: 10, logo: '💻' },
      { name: 'StartupHub', offers: 8, logo: '🚀' },
      { name: 'CodeFactory', offers: 7, logo: '⚡' },
    ];

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Top Empresas</h3>
          <span class="admin-badge admin-badge--info">Este Mes</span>
        </div>
        <div class="admin-card__body">
          <div style="display: grid; gap: 12px;">
            ${companies.map((company, index) => `
              <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: ${index === 0 ? '#003e7e10' : '#f5f5f5'};
                border-radius: 8px;
                border-left: 3px solid ${index === 0 ? '#003e7e' : 'transparent'};
              ">
                <div style="
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 1.5rem;
                  background: white;
                  border-radius: 8px;
                ">
                  ${company.logo}
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 600; color: var(--color-text-primary); margin-bottom: 2px;">
                    ${company.name}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--color-text-secondary);">
                    ${company.offers} ofertas publicadas
                  </div>
                </div>
                ${index === 0 ? '<div style="font-size: 1.25rem;">🏆</div>' : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Renderiza top estudiantes
   */
  renderTopStudents() {
    const container = document.getElementById('adminTopStudents');
    if (!container) return;

    const students = [
      { name: 'María García', applications: 12, avatar: '👩' },
      { name: 'Juan Pérez', applications: 10, avatar: '👨' },
      { name: 'Ana López', applications: 9, avatar: '👩' },
      { name: 'Carlos Ruiz', applications: 8, avatar: '👨' },
      { name: 'Laura Martínez', applications: 7, avatar: '👩' },
    ];

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Estudiantes Más Activos</h3>
          <span class="admin-badge admin-badge--success">Este Mes</span>
        </div>
        <div class="admin-card__body">
          <div style="display: grid; gap: 12px;">
            ${students.map((student, index) => `
              <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: ${index === 0 ? '#4caf5010' : '#f5f5f5'};
                border-radius: 8px;
                border-left: 3px solid ${index === 0 ? '#4caf50' : 'transparent'};
              ">
                <div style="
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 1.5rem;
                  background: white;
                  border-radius: 50%;
                ">
                  ${student.avatar}
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 600; color: var(--color-text-primary); margin-bottom: 2px;">
                    ${student.name}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--color-text-secondary);">
                    ${student.applications} postulaciones
                  </div>
                </div>
                ${index === 0 ? '<div style="font-size: 1.25rem;">⭐</div>' : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Renderiza alertas importantes
   */
  renderAlerts() {
    const container = document.getElementById('adminAlerts');
    if (!container) return;

    const alerts = [
      {
        type: 'warning',
        title: '32 ofertas pendientes de revisión',
        message: 'Hay ofertas esperando aprobación del administrador',
        action: 'Revisar Ofertas',
        route: '/ofertas',
        count: 32,
        actionType: 'navigate', // solo navegar
      },
      {
        type: 'info',
        title: 'Nuevo reporte disponible',
        message: 'Reporte mensual de octubre ya está listo',
        action: 'Abrir Reporte',
        route: '/reportes',
        reportId: 1, // ID del reporte a abrir
        actionType: 'openReport', // abrir reporte específico
      },
      {
        type: 'success',
        title: '15 nuevas postulaciones hoy',
        message: 'Los estudiantes están muy activos',
        action: 'Ver Postulaciones',
        route: '/ofertas',
        count: 15,
        actionType: 'navigate',
      },
    ];

    container.innerHTML = alerts.map((alert, index) => {
      const colors = {
        warning: { border: '#ff9800', text: '#e65100', icon: '#ff9800' },
        info: { border: '#2196f3', text: '#0d47a1', icon: '#2196f3' },
        success: { border: '#4caf50', text: '#1b5e20', icon: '#4caf50' },
      };
      
      const color = colors[alert.type];
      
      return `
        <div style="
          padding: 16px;
          border-left: 4px solid ${color.border};
          background: white;
          border-radius: 8px;
          transition: all 0.2s ease;
        " 
        onmouseover="this.style.background='#f9f9f9';"
        onmouseout="this.style.background='white';"
        >
          <div style="display: flex; align-items: start; gap: 12px;">
            <div style="
              width: 40px;
              height: 40px;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: ${color.icon};
              color: white;
              border-radius: 8px;
              font-size: 1.25rem;
            ">
              ${alert.type === 'warning' ? '⚠️' : alert.type === 'info' ? 'ℹ️' : '✅'}
            </div>
            <div style="flex: 1;">
              <div style="
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;
              ">
                <h4 style="
                  font-weight: 600;
                  color: var(--color-text-primary);
                  margin: 0;
                  font-size: 0.9375rem;
                ">
                  ${alert.title}
                </h4>
                ${alert.count ? `
                  <span class="admin-badge" style="
                    background: ${color.icon};
                    color: white;
                    font-weight: 600;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 0.75rem;
                  ">
                    ${alert.count}
                  </span>
                ` : ''}
              </div>
              <p style="
                font-size: 0.8125rem;
                color: var(--color-text-secondary);
                margin: 0 0 12px 0;
                line-height: 1.4;
              ">
                ${alert.message}
              </p>
              <button 
                class="admin-button admin-button--sm"
                style="
                  background: ${color.icon};
                  color: white;
                  border: none;
                  font-weight: 600;
                  padding: 8px 16px;
                  font-size: 0.8125rem;
                "
                onmouseover="this.style.opacity='0.9';"
                onmouseout="this.style.opacity='1';"
                onclick="AdminDashboard.handleAlertAction('${alert.actionType}', '${alert.route}', ${alert.reportId || 'null'})"
              >
                ${alert.action} →
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Maneja la acción de una alerta
   */
  handleAlertAction(actionType, route, reportId) {
    if (actionType === 'openReport' && reportId) {
      // Navegar a reportes y abrir el reporte específico
      if (typeof AdminRouter !== 'undefined') {
        AdminRouter.navigate(route);
        // Esperar a que se renderice la vista y luego abrir el reporte
        setTimeout(() => {
          if (typeof AdminReports !== 'undefined') {
            AdminReports.previewReport(reportId);
          }
        }, 300);
      }
    } else {
      // Solo navegar a la ruta
      this.handleQuickAction(route);
    }
  },

  /**
   * Renderiza eventos próximos
   */
  renderUpcomingEvents() {
    const container = document.getElementById('adminUpcomingEvents');
    if (!container) return;

    const events = [
      {
        date: '15 Oct',
        title: 'Feria de Prácticas Virtual',
        time: '10:00 AM',
        type: 'event',
      },
      {
        date: '20 Oct',
        title: 'Cierre de Convocatoria Semestre 2',
        time: '11:59 PM',
        type: 'deadline',
      },
      {
        date: '25 Oct',
        title: 'Reunión con Empresas',
        time: '2:00 PM',
        type: 'meeting',
      },
    ];

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Próximos Eventos</h3>
        </div>
        <div class="admin-card__body">
          <div style="display: grid; gap: 12px;">
            ${events.map(event => `
              <div style="
                display: flex;
                gap: 12px;
                padding: 12px;
                background: #f5f5f5;
                border-radius: 8px;
              ">
                <div style="
                  width: 50px;
                  text-align: center;
                  padding: 8px;
                  background: white;
                  border-radius: 8px;
                  border: 2px solid #003e7e;
                ">
                  <div style="font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 600;">
                    ${event.date.split(' ')[1]}
                  </div>
                  <div style="font-size: 1.25rem; font-weight: 700; color: #003e7e;">
                    ${event.date.split(' ')[0]}
                  </div>
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 600; color: var(--color-text-primary); margin-bottom: 4px;">
                    ${event.title}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--color-text-secondary);">
                    🕐 ${event.time}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
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
      business: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
        </svg>
      `,
    };

    return icons[iconName] || icons.assessment;
  },

  /**
   * Obtiene estadísticas del dashboard desde la API
   */
  async fetchDashboardStats() {
    try {
      AdminUI.showLoader(true);
      
      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      const data = await AdminAPI.dashboard.getStats();
      AdminConfig.mockData.dashboardStats = {
        totalUsers: data.totalUsers,
        pendingOffers: data.pendingOffers,
        activeInternships: data.activeInternships,
      };
      this.renderSummaryCards();
      */
      
      AdminUI.showLoader(false);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      AdminUI.showToast(AdminConfig.messages.errors.network, 'error');
      AdminUI.showLoader(false);
    }
  },

  /**
   * Obtiene actividad reciente desde la API
   */
  async fetchRecentActivity() {
    try {
      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      const data = await AdminAPI.dashboard.getActivity({ limit: 5 });
      AdminConfig.mockData.recentActivity = data.map(activity => ({
        id: activity.id,
        description: activity.description,
        time: AdminConfig.formatters.formatRelativeTime(new Date(activity.time)),
        timestamp: new Date(activity.timestamp),
      }));
      this.renderRecentActivity();
      */
    } catch (error) {
      console.error('Error al obtener actividad reciente:', error);
      AdminUI.showToast(AdminConfig.messages.errors.network, 'error');
    }
  },

  /**
   * Refresca todos los datos del dashboard
   */
  async refresh() {
    AdminUI.showToast('Actualizando dashboard...', 'info', 1500);
    
    // TODO: Descomentar cuando la API esté lista
    // await Promise.all([
    //   this.fetchDashboardStats(),
    // ]);
    
    // Re-renderizar todos los componentes
    this.renderSummaryCards();
    this.renderAlerts();
    this.renderQuickActions();
    this.renderCharts();
    this.renderUpcomingEvents();
    
    AdminUI.showToast('Dashboard actualizado', 'success');
  },
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AdminDashboard.init());
} else {
  AdminDashboard.init();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminDashboard;
}
