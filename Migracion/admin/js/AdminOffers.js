/**
 * AdminOffers.js
 * Gestión de ofertas: aprobación, rechazo, supervisión
 */

const AdminOffers = {
  /**
   * Estado actual de ofertas
   */
  state: {
    offers: [],
    filteredOffers: [],
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
    filters: {
      search: '',
      status: 'all',
      company: 'all',
    },
  },

  /**
   * Inicializa el módulo de ofertas
   */
  init() {
    this.loadOffers();
    this.attachEventListeners();
    console.log('AdminOffers inicializado');
  },

  /**
   * Carga ofertas desde la API
   * Usa datos mock si AdminAPI no está disponible
   */
  async loadOffers() {
    try {
      AdminUI.showLoader(true);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      const params = {
        page: this.state.currentPage,
        page_size: this.state.itemsPerPage,
        search: this.state.filters.search,
        status: this.state.filters.status !== 'all' ? this.state.filters.status.toLowerCase() : undefined,
      };
      
      const response = await AdminAPI.offers.list(params);
      this.state.offers = response.results;
      this.state.totalPages = Math.ceil(response.count / this.state.itemsPerPage);
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      this.state.offers = this.generateMockOffers(30);
      this.state.filteredOffers = [...this.state.offers];
      this.calculatePagination();
      this.render();

      AdminUI.showLoader(false);
    } catch (error) {
      console.error('Error al cargar ofertas:', error);
      AdminUI.showToast(AdminConfig.messages.errors.network, 'error');
      AdminUI.showLoader(false);
    }
  },

  /**
   * Genera ofertas mock para desarrollo
   */
  generateMockOffers(count) {
    const titles = [
      'Desarrollador Web Frontend',
      'Diseñador UI/UX',
      'Analista de Datos',
      'Desarrollador Backend',
      'Ingeniero de Software',
      'Especialista en Marketing Digital',
      'Contador Junior',
      'Asistente Administrativo',
      'Desarrollador Mobile',
      'Analista de Sistemas',
    ];

    const companies = [
      'Empresa Tech Solutions',
      'Empresa Data Corp',
      'Empresa XYZ',
      'Empresa Innovate SA',
      'Empresa Digital Plus',
      'Empresa Global Systems',
    ];

    const statuses = ['Pendiente', 'Aprobada', 'Rechazada', 'Cerrada'];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: titles[Math.floor(Math.random() * titles.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      description: 'Descripción de la oferta de práctica profesional...',
      requirements: 'Estudiante activo, conocimientos en...',
      salary: Math.floor(Math.random() * 2000000) + 1000000,
      duration: Math.floor(Math.random() * 6) + 3,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      applications: Math.floor(Math.random() * 50),
      location: 'Medellín, Colombia',
      modality: ['Presencial', 'Remoto', 'Híbrido'][Math.floor(Math.random() * 3)],
    }));
  },

  /**
   * Adjunta event listeners
   */
  attachEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('offerSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.filters.search = e.target.value;
        this.applyFilters();
      });
    }

    // Filtro de estado
    const statusSelect = document.getElementById('offerStatusFilter');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.state.filters.status = e.target.value;
        this.applyFilters();
      });
    }
  },

  /**
   * Aplica filtros a la lista de ofertas
   */
  applyFilters() {
    let filtered = [...this.state.offers];

    // Filtro de búsqueda
    if (this.state.filters.search) {
      const search = this.state.filters.search.toLowerCase();
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(search) ||
        offer.company.toLowerCase().includes(search)
      );
    }

    // Filtro de estado
    if (this.state.filters.status !== 'all') {
      filtered = filtered.filter(offer => offer.status === this.state.filters.status);
    }

    this.state.filteredOffers = filtered;
    this.state.currentPage = 1;
    this.calculatePagination();
    this.render();
  },

  /**
   * Calcula paginación
   */
  calculatePagination() {
    this.state.totalPages = Math.ceil(
      this.state.filteredOffers.length / this.state.itemsPerPage
    );
  },

  /**
   * Cambia de página
   */
  goToPage(page) {
    if (page < 1 || page > this.state.totalPages) return;
    this.state.currentPage = page;
    this.render();
  },

  /**
   * Renderiza la vista de ofertas
   */
  render() {
    const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
    const end = start + this.state.itemsPerPage;
    const pageOffers = this.state.filteredOffers.slice(start, end);

    this.renderTable(pageOffers);
    this.renderPagination();
    this.renderStats();
  },

  /**
   * Renderiza la tabla de ofertas
   */
  renderTable(offers) {
    const tbody = document.getElementById('offersTableBody');
    if (!tbody) return;

    if (offers.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="admin-table__cell" style="text-align: center; padding: 40px;">
            No se encontraron ofertas
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = offers.map(offer => `
      <tr class="admin-table__row">
        <td class="admin-table__cell">${offer.id}</td>
        <td class="admin-table__cell">
          <div style="font-weight: 500;">${offer.title}</div>
          <div style="font-size: 0.875rem; color: var(--color-text-secondary);">
            ${offer.company}
          </div>
        </td>
        <td class="admin-table__cell">
          <span class="admin-badge admin-badge--${this.getStatusBadgeClass(offer.status)}">
            ${offer.status}
          </span>
        </td>
        <td class="admin-table__cell">${offer.applications} postulaciones</td>
        <td class="admin-table__cell">${AdminConfig.formatters.formatRelativeTime(offer.createdAt)}</td>
        <td class="admin-table__cell">
          <button 
            class="admin-button admin-button--sm admin-button--ghost"
            onclick="AdminOffers.viewOffer(${offer.id})"
            title="Ver detalles">
            Ver
          </button>
          ${offer.status === 'Pendiente' ? `
            <button 
              class="admin-button admin-button--sm admin-button--primary"
              onclick="AdminOffers.approveOffer(${offer.id})"
              title="Aprobar oferta">
              Aprobar
            </button>
            <button 
              class="admin-button admin-button--sm admin-button--outline"
              onclick="AdminOffers.rejectOffer(${offer.id})"
              title="Rechazar oferta"
              style="color: var(--color-error); border-color: var(--color-error);">
              Rechazar
            </button>
          ` : ''}
        </td>
      </tr>
    `).join('');
  },

  /**
   * Renderiza la paginación
   */
  renderPagination() {
    const container = document.getElementById('offersPagination');
    if (!container) return;

    const { currentPage, totalPages } = this.state;
    
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
        <button 
          class="admin-button admin-button--sm admin-button--outline"
          onclick="AdminOffers.goToPage(${currentPage - 1})"
          ${currentPage === 1 ? 'disabled' : ''}>
          Anterior
        </button>
        
        ${pages.map(page => {
          if (page === '...') {
            return '<span style="padding: 0 8px;">...</span>';
          }
          return `
            <button 
              class="admin-button admin-button--sm ${page === currentPage ? 'admin-button--primary' : 'admin-button--outline'}"
              onclick="AdminOffers.goToPage(${page})">
              ${page}
            </button>
          `;
        }).join('')}
        
        <button 
          class="admin-button admin-button--sm admin-button--outline"
          onclick="AdminOffers.goToPage(${currentPage + 1})"
          ${currentPage === totalPages ? 'disabled' : ''}>
          Siguiente
        </button>
      </div>
    `;
  },

  /**
   * Renderiza estadísticas de ofertas
   */
  renderStats() {
    const container = document.getElementById('offersStats');
    if (!container) return;

    const total = this.state.filteredOffers.length;
    const pending = this.state.filteredOffers.filter(o => o.status === 'Pendiente').length;
    const approved = this.state.filteredOffers.filter(o => o.status === 'Aprobada').length;
    const rejected = this.state.filteredOffers.filter(o => o.status === 'Rechazada').length;

    container.innerHTML = `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 150px;">
          <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Total</div>
          <div style="font-size: 1.5rem; font-weight: 600; color: var(--color-primary);">${total}</div>
        </div>
        <div style="flex: 1; min-width: 150px;">
          <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Pendientes</div>
          <div style="font-size: 1.5rem; font-weight: 600; color: var(--color-warning);">${pending}</div>
        </div>
        <div style="flex: 1; min-width: 150px;">
          <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Aprobadas</div>
          <div style="font-size: 1.5rem; font-weight: 600; color: var(--color-success);">${approved}</div>
        </div>
        <div style="flex: 1; min-width: 150px;">
          <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Rechazadas</div>
          <div style="font-size: 1.5rem; font-weight: 600; color: var(--color-error);">${rejected}</div>
        </div>
      </div>
    `;
  },

  /**
   * Obtiene la clase de badge según el estado
   */
  getStatusBadgeClass(status) {
    const classes = {
      'Pendiente': 'warning',
      'Aprobada': 'success',
      'Rechazada': 'error',
      'Cerrada': 'secondary',
    };
    return classes[status] || 'info';
  },

  /**
   * Ver detalles de una oferta
   */
  async viewOffer(offerId) {
    const offer = this.state.offers.find(o => o.id === offerId);
    if (!offer) return;

    AdminUI.showModal('offerDetailModal', {
      title: 'Detalles de la Oferta',
      content: `
        <div style="display: grid; gap: 16px;">
          <div>
            <strong>ID:</strong> ${offer.id}
          </div>
          <div>
            <strong>Título:</strong> ${offer.title}
          </div>
          <div>
            <strong>Empresa:</strong> ${offer.company}
          </div>
          <div>
            <strong>Descripción:</strong><br>
            ${offer.description}
          </div>
          <div>
            <strong>Requisitos:</strong><br>
            ${offer.requirements}
          </div>
          <div>
            <strong>Salario:</strong> $${AdminConfig.formatters.formatNumber(offer.salary)} COP
          </div>
          <div>
            <strong>Duración:</strong> ${offer.duration} meses
          </div>
          <div>
            <strong>Modalidad:</strong> ${offer.modality}
          </div>
          <div>
            <strong>Ubicación:</strong> ${offer.location}
          </div>
          <div>
            <strong>Estado:</strong> 
            <span class="admin-badge admin-badge--${this.getStatusBadgeClass(offer.status)}">
              ${offer.status}
            </span>
          </div>
          <div>
            <strong>Postulaciones:</strong> ${offer.applications}
          </div>
          <div>
            <strong>Fecha de publicación:</strong> ${AdminConfig.formatters.formatDate(offer.createdAt)}
          </div>
        </div>
      `,
    });
  },

  /**
   * Aprobar oferta
   */
  async approveOffer(offerId) {
    const offer = this.state.offers.find(o => o.id === offerId);
    if (!offer) return;

    const confirmed = await AdminUI.confirm(
      `La oferta "${offer.title}" de ${offer.company} será publicada y visible para todos los estudiantes.`,
      {
        title: 'Aprobar Oferta',
        confirmText: 'Sí, Aprobar',
        cancelText: 'Cancelar',
        type: 'info'
      }
    );

    if (!confirmed) return;

    try {
      AdminUI.showLoader(true);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      await AdminAPI.offers.approve(offerId);
      await this.loadOffers(); // Recargar lista
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      const offerIndex = this.state.offers.findIndex(o => o.id === offerId);
      if (offerIndex !== -1) {
        this.state.offers[offerIndex].status = 'Aprobada';
      }

      this.applyFilters();
      AdminUI.showToast('Oferta aprobada exitosamente', 'success');
      AdminUI.showLoader(false);
    } catch (error) {
      console.error('Error al aprobar oferta:', error);
      AdminUI.showToast(AdminConfig.messages.errors.server, 'error');
      AdminUI.showLoader(false);
    }
  },

  /**
   * Rechazar oferta
   */
  async rejectOffer(offerId) {
    const offer = this.state.offers.find(o => o.id === offerId);
    if (!offer) return;

    AdminUI.showModal('rejectOfferModal', {
      title: 'Rechazar Oferta',
      content: `
        <form id="rejectOfferForm" style="display: grid; gap: 16px;">
          <p>¿Estás seguro de rechazar la oferta "${offer.title}" de ${offer.company}?</p>
          <div class="admin-form-group">
            <label class="admin-form-label">Motivo del rechazo</label>
            <textarea 
              class="admin-form-input" 
              name="reason" 
              rows="4" 
              placeholder="Describe el motivo del rechazo..."
              required></textarea>
          </div>
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button type="button" class="admin-button admin-button--outline" onclick="AdminUI.closeCurrentModal()">
              Cancelar
            </button>
            <button type="submit" class="admin-button admin-button--primary" style="background: var(--color-error);">
              Rechazar Oferta
            </button>
          </div>
        </form>
      `,
      onOpen: () => {
        document.getElementById('rejectOfferForm').addEventListener('submit', (e) => {
          e.preventDefault();
          const reason = new FormData(e.target).get('reason');
          this.confirmRejectOffer(offerId, reason);
        });
      },
    });
  },

  /**
   * Confirma el rechazo de una oferta
   */
  async confirmRejectOffer(offerId, reason) {
    try {
      AdminUI.showLoader(true);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      await AdminAPI.offers.reject(offerId, reason);
      await this.loadOffers(); // Recargar lista
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      const offerIndex = this.state.offers.findIndex(o => o.id === offerId);
      if (offerIndex !== -1) {
        this.state.offers[offerIndex].status = 'Rechazada';
        this.state.offers[offerIndex].rejectionReason = reason;
      }

      this.applyFilters();
      AdminUI.closeCurrentModal();
      AdminUI.showToast('Oferta rechazada', 'success');
      AdminUI.showLoader(false);
    } catch (error) {
      console.error('Error al rechazar oferta:', error);
      AdminUI.showToast(AdminConfig.messages.errors.server, 'error');
      AdminUI.showLoader(false);
    }
  },

  /**
   * Exportar ofertas a CSV
   */
  exportToCSV() {
    const headers = ['ID', 'Título', 'Empresa', 'Estado', 'Postulaciones', 'Fecha'];
    const rows = this.state.filteredOffers.map(offer => [
      offer.id,
      offer.title,
      offer.company,
      offer.status,
      offer.applications,
      AdminConfig.formatters.formatDate(offer.createdAt),
    ]);

    let csv = headers.join(',') + '\n';
    csv += rows.map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ofertas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    AdminUI.showToast('Ofertas exportadas exitosamente', 'success');
  },
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminOffers;
}
