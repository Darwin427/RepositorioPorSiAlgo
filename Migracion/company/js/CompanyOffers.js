/**
 * CompanyOffers.js
 * Gestión de ofertas de la empresa
 */

const CompanyOffers = {
  /**
   * Ofertas cargadas actualmente
   */
  offers: [],

  /**
   * Filtros activos
   */
  filters: {
    status: 'all', // all, active, draft, closed
    search: '',
  },

  /**
   * Inicializa el módulo de ofertas
   */
  init() {
    this.loadOffers();
    console.log('CompanyOffers inicializado');
  },

  /**
   * Carga las ofertas desde la API o datos mock
   */
  async loadOffers() {
    try {
      CompanyUI.showLoader(true);
      
      // TODO: Reemplazar con llamada real a la API
      // const data = await apiRequest(CompanyConfig.api.endpoints.myOffers);
      // this.offers = data;
      
      // Datos mock por ahora
      this.offers = this.getMockOffers();
      
      CompanyUI.showLoader(false);
    } catch (error) {
      console.error('Error al cargar ofertas:', error);
      CompanyUI.showToast(CompanyConfig.messages.errors.network, 'error');
      CompanyUI.showLoader(false);
    }
  },

  /**
   * Obtiene ofertas mock para desarrollo
   * @returns {Array} Array de ofertas
   */
  getMockOffers() {
    return [
      {
        id: 1,
        title: 'Desarrollador Web Frontend',
        description: 'Buscamos desarrollador frontend con experiencia en React',
        area: 'Tecnología',
        status: 'active',
        applicants: 5,
        vacancies: 2,
        duration: 6,
        modality: 'Híbrido',
        requirements: 'React, JavaScript, CSS',
        publishedDate: '2025-10-01',
        createdDate: '2025-09-28',
      },
      {
        id: 2,
        title: 'Diseñador UI/UX',
        description: 'Diseñador con experiencia en interfaces de usuario',
        area: 'Diseño',
        status: 'active',
        applicants: 3,
        vacancies: 1,
        duration: 6,
        modality: 'Remoto',
        requirements: 'Figma, Adobe XD, Sketch',
        publishedDate: '2025-09-28',
        createdDate: '2025-09-25',
      },
      {
        id: 3,
        title: 'Analista de Datos',
        description: 'Analista para procesamiento y visualización de datos',
        area: 'Tecnología',
        status: 'draft',
        applicants: 0,
        vacancies: 1,
        duration: 6,
        modality: 'Presencial',
        requirements: 'Python, SQL, Power BI',
        publishedDate: null,
        createdDate: '2025-10-05',
      },
      {
        id: 4,
        title: 'Desarrollador Backend',
        description: 'Desarrollador backend con experiencia en Django',
        area: 'Tecnología',
        status: 'closed',
        applicants: 4,
        vacancies: 1,
        duration: 6,
        modality: 'Híbrido',
        requirements: 'Python, Django, PostgreSQL',
        publishedDate: '2025-09-15',
        createdDate: '2025-09-10',
      },
    ];
  },

  /**
   * Obtiene estadísticas de las ofertas
   * @returns {Object} Estadísticas
   */
  getStats() {
    return {
      active: this.offers.filter(o => o.status === 'active').length,
      drafts: this.offers.filter(o => o.status === 'draft').length,
      closed: this.offers.filter(o => o.status === 'closed').length,
      totalApplicants: this.offers.reduce((sum, o) => sum + o.applicants, 0),
    };
  },

  /**
   * Filtra las ofertas según los filtros activos
   * @returns {Array} Ofertas filtradas
   */
  getFilteredOffers() {
    let filtered = [...this.offers];

    // Filtrar por estado
    if (this.filters.status !== 'all') {
      filtered = filtered.filter(o => o.status === this.filters.status);
    }

    // Filtrar por búsqueda
    if (this.filters.search) {
      const search = this.filters.search.toLowerCase();
      filtered = filtered.filter(o => 
        o.title.toLowerCase().includes(search) ||
        o.description.toLowerCase().includes(search) ||
        o.area.toLowerCase().includes(search)
      );
    }

    return filtered;
  },

  /**
   * Renderiza la tabla de ofertas
   * @param {string} containerId - ID del contenedor
   */
  renderOffersTable(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const offers = this.getFilteredOffers();

    if (offers.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <p>No se encontraron ofertas</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
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
          ${offers.map(offer => this.renderOfferRow(offer)).join('')}
        </tbody>
      </table>
    `;
  },

  /**
   * Renderiza una fila de oferta
   * @param {Object} offer - Datos de la oferta
   * @returns {string} HTML de la fila
   */
  renderOfferRow(offer) {
    const statusBadge = this.getStatusBadge(offer.status);
    const date = offer.publishedDate || '-';

    return `
      <tr class="company-table__row">
        <td class="company-table__cell">
          <div style="font-weight: 500;">${offer.title}</div>
          <div style="font-size: 0.875rem; color: #666;">${offer.area}</div>
        </td>
        <td class="company-table__cell">${statusBadge}</td>
        <td class="company-table__cell">
          <span style="font-weight: 500;">${offer.applicants}</span>
        </td>
        <td class="company-table__cell">${date}</td>
        <td class="company-table__cell">
          <button 
            class="company-button company-button--sm company-button--ghost"
            onclick="CompanyOffers.viewOffer(${offer.id})"
          >
            Ver
          </button>
          <button 
            class="company-button company-button--sm company-button--ghost"
            onclick="CompanyOffers.editOffer(${offer.id})"
          >
            Editar
          </button>
          ${offer.status === 'draft' ? `
            <button 
              class="company-button company-button--sm company-button--primary"
              onclick="CompanyOffers.publishOffer(${offer.id})"
            >
              Publicar
            </button>
          ` : ''}
          ${offer.status === 'active' ? `
            <button 
              class="company-button company-button--sm company-button--outline"
              onclick="CompanyOffers.closeOffer(${offer.id})"
            >
              Cerrar
            </button>
          ` : ''}
        </td>
      </tr>
    `;
  },

  /**
   * Obtiene el badge HTML según el estado
   * @param {string} status - Estado de la oferta
   * @returns {string} HTML del badge
   */
  getStatusBadge(status) {
    const badges = {
      active: '<span class="company-badge company-badge--success">Activa</span>',
      draft: '<span class="company-badge company-badge--warning">Borrador</span>',
      closed: '<span class="company-badge company-badge--error">Cerrada</span>',
    };
    return badges[status] || badges.draft;
  },

  /**
   * Ver detalles de una oferta
   * @param {number} offerId - ID de la oferta
   */
  async viewOffer(offerId) {
    const offer = this.offers.find(o => o.id === offerId);
    if (!offer) {
      CompanyUI.showToast('Oferta no encontrada', 'error');
      return;
    }

    // Crear modal con detalles
    this.showOfferDetailsModal(offer);
  },

  /**
   * Muestra modal con detalles de la oferta
   * @param {Object} offer - Datos de la oferta
   */
  showOfferDetailsModal(offer) {
    // Crear modal si no existe
    let modal = document.getElementById('offerDetailsModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'offerDetailsModal';
      modal.className = 'company-modal';
      document.body.appendChild(modal);
    }

    const statusBadge = this.getStatusBadge(offer.status);
    const publishDate = offer.publishedDate || 'No publicada';

    modal.innerHTML = `
      <div class="company-modal__backdrop" onclick="CompanyOffers.closeOfferDetailsModal()"></div>
      <div class="company-modal__content" style="max-width: 700px;">
        <div class="company-modal__header">
          <h3 class="company-modal__title">Detalles de la Oferta</h3>
          <button class="company-modal__close" onclick="CompanyOffers.closeOfferDetailsModal()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="company-modal__body">
          <div style="margin-bottom: 20px;">
            <h2 style="margin-bottom: 10px;">${offer.title}</h2>
            <div style="display: flex; gap: 10px; align-items: center;">
              ${statusBadge}
              <span style="color: #666;">•</span>
              <span style="color: #666;">${offer.area}</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
            <div>
              <div style="font-weight: 500; margin-bottom: 5px;">Modalidad</div>
              <div style="color: #666;">${offer.modality}</div>
            </div>
            <div>
              <div style="font-weight: 500; margin-bottom: 5px;">Duración</div>
              <div style="color: #666;">${offer.duration} meses</div>
            </div>
            <div>
              <div style="font-weight: 500; margin-bottom: 5px;">Vacantes</div>
              <div style="color: #666;">${offer.vacancies}</div>
            </div>
            <div>
              <div style="font-weight: 500; margin-bottom: 5px;">Postulantes</div>
              <div style="color: #666;">${offer.applicants}</div>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <div style="font-weight: 500; margin-bottom: 5px;">Descripción</div>
            <div style="color: #666; line-height: 1.6;">${offer.description}</div>
          </div>

          ${offer.requirements ? `
            <div style="margin-bottom: 20px;">
              <div style="font-weight: 500; margin-bottom: 5px;">Requisitos</div>
              <div style="color: #666; line-height: 1.6;">${offer.requirements}</div>
            </div>
          ` : ''}

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <div>
              <div style="font-weight: 500; margin-bottom: 5px;">Fecha de Creación</div>
              <div style="color: #666;">${offer.createdDate}</div>
            </div>
            <div>
              <div style="font-weight: 500; margin-bottom: 5px;">Fecha de Publicación</div>
              <div style="color: #666;">${publishDate}</div>
            </div>
          </div>
        </div>
        <div class="company-modal__footer">
          <button class="company-button company-button--ghost" onclick="CompanyOffers.closeOfferDetailsModal()">
            Cerrar
          </button>
          <button class="company-button company-button--outline" onclick="CompanyOffers.closeOfferDetailsModal(); CompanyOffers.editOffer(${offer.id});">
            Editar
          </button>
          ${offer.status === 'active' ? `
            <button class="company-button company-button--primary" onclick="CompanyOffers.viewOfferApplicants(${offer.id});">
              Ver Postulantes
            </button>
          ` : ''}
        </div>
      </div>
    `;

    // Agregar estilos del modal si no existen
    if (!document.getElementById('companyModalStyles')) {
      const style = document.createElement('style');
      style.id = 'companyModalStyles';
      style.textContent = `
        .company-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: none;
          overflow-y: auto;
        }
        .company-modal--open {
          display: block;
        }
        .company-modal__backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: -1;
        }
        .company-modal__content {
          position: relative;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 700px;
          margin: 37px auto 20px auto;
          display: flex;
          flex-direction: column;
        }
        .company-modal__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #e0e0e0;
          flex-shrink: 0;
          background: white;
          border-radius: 12px 12px 0 0;
        }
        .company-modal__title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1b1b1f;
        }
        .company-modal__close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s;
          color: #666;
        }
        .company-modal__close:hover {
          background: #f5f5f5;
        }
        .company-modal__body {
          padding: 24px;
          flex: 1;
        }
        .company-modal__footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding: 16px 24px;
          border-top: 1px solid #e0e0e0;
          flex-shrink: 0;
          background: white;
          border-radius: 0 0 12px 12px;
        }
        
        @media (max-width: 768px) {
          .company-modal__content {
            margin: 15px auto 15px auto;
            width: 95%;
          }
          .company-modal__body {
            padding: 16px;
          }
          .company-modal__footer {
            flex-wrap: wrap;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Mostrar modal
    modal.classList.add('company-modal--open');
    document.body.style.overflow = 'hidden';
  },

  /**
   * Cierra el modal de detalles
   */
  closeOfferDetailsModal() {
    const modal = document.getElementById('offerDetailsModal');
    if (modal) {
      modal.classList.remove('company-modal--open');
      document.body.style.overflow = '';
    }
  },

  /**
   * Ver postulantes de una oferta específica
   * @param {number} offerId - ID de la oferta
   */
  viewOfferApplicants(offerId) {
    // Cerrar modal
    this.closeOfferDetailsModal();
    
    // Navegar a postulantes con filtro de oferta
    CompanyRouter.navigateToApplicantsWithFilter(offerId);
  },

  /**
   * Editar una oferta
   * @param {number} offerId - ID de la oferta
   */
  async editOffer(offerId) {
    const offer = this.offers.find(o => o.id === offerId);
    if (!offer) {
      CompanyUI.showToast('Oferta no encontrada', 'error');
      return;
    }

    // Navegar a vista de edición
    CompanyRouter.navigate(`/ofertas/editar/${offerId}`);
  },

  /**
   * Actualizar una oferta existente
   * @param {number} offerId - ID de la oferta
   * @param {Object} offerData - Datos actualizados de la oferta
   */
  async updateOffer(offerId, offerData) {
    try {
      CompanyUI.showLoader(true);

      // TODO: Llamada real a la API
      // await apiRequest(CompanyConfig.api.endpoints.updateOffer(offerId), {
      //   method: 'PATCH',
      //   body: JSON.stringify(offerData),
      // });

      // Actualizar localmente por ahora
      const offer = this.offers.find(o => o.id === offerId);
      if (offer) {
        Object.assign(offer, offerData);
      }

      CompanyUI.showLoader(false);
      CompanyUI.showToast('Oferta actualizada exitosamente', 'success');
      
      // Navegar de vuelta a la lista de ofertas
      CompanyRouter.navigate('/ofertas');
    } catch (error) {
      console.error('Error al actualizar oferta:', error);
      CompanyUI.showToast(CompanyConfig.messages.errors.server, 'error');
      CompanyUI.showLoader(false);
    }
  },

  /**
   * Publicar una oferta (cambiar de borrador a activa)
   * @param {number} offerId - ID de la oferta
   */
  async publishOffer(offerId) {
    const confirmed = await CompanyUI.confirm(
      'Esta oferta estará visible para todos los estudiantes y comenzarás a recibir postulaciones.',
      {
        title: '¿Publicar esta oferta?',
        confirmText: 'Publicar',
        cancelText: 'Cancelar',
        type: 'info',
      }
    );
    if (!confirmed) return;

    try {
      CompanyUI.showLoader(true);

      // TODO: Llamada real a la API
      // await apiRequest(CompanyConfig.api.endpoints.updateOffer(offerId), {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: 'active' }),
      // });

      // Actualizar localmente por ahora
      const offer = this.offers.find(o => o.id === offerId);
      if (offer) {
        offer.status = 'active';
        offer.publishedDate = new Date().toISOString().split('T')[0];
      }

      CompanyUI.showLoader(false);
      CompanyUI.showToast(CompanyConfig.messages.success.published, 'success');
      
      // Re-renderizar si estamos en la vista de ofertas
      if (CompanyRouter.currentView === 'offers') {
        CompanyRouter.renderOffersView();
      }
    } catch (error) {
      console.error('Error al publicar oferta:', error);
      CompanyUI.showToast(CompanyConfig.messages.errors.server, 'error');
      CompanyUI.showLoader(false);
    }
  },

  /**
   * Cerrar una oferta activa
   * @param {number} offerId - ID de la oferta
   */
  async closeOffer(offerId) {
    const confirmed = await CompanyUI.confirm(
      'No recibirás más postulaciones y la oferta dejará de estar visible para los estudiantes.',
      {
        title: '¿Cerrar esta oferta?',
        confirmText: 'Cerrar Oferta',
        cancelText: 'Cancelar',
        type: 'warning',
      }
    );
    if (!confirmed) return;

    try {
      CompanyUI.showLoader(true);

      // TODO: Llamada real a la API
      // await apiRequest(CompanyConfig.api.endpoints.updateOffer(offerId), {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: 'closed' }),
      // });

      // Actualizar localmente por ahora
      const offer = this.offers.find(o => o.id === offerId);
      if (offer) {
        offer.status = 'closed';
      }

      CompanyUI.showLoader(false);
      CompanyUI.showToast('Oferta cerrada exitosamente', 'success');
      
      // Re-renderizar si estamos en la vista de ofertas
      if (CompanyRouter.currentView === 'offers') {
        CompanyRouter.renderOffersView();
      }
    } catch (error) {
      console.error('Error al cerrar oferta:', error);
      CompanyUI.showToast(CompanyConfig.messages.errors.server, 'error');
      CompanyUI.showLoader(false);
    }
  },

  /**
   * Eliminar una oferta
   * @param {number} offerId - ID de la oferta
   */
  async deleteOffer(offerId) {
    const confirmed = await CompanyUI.confirm(
      'Esta acción no se puede deshacer. Se eliminarán todos los datos relacionados con esta oferta.',
      {
        title: '¿Eliminar esta oferta?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger',
      }
    );
    if (!confirmed) return;

    try {
      CompanyUI.showLoader(true);

      // TODO: Llamada real a la API
      // await apiRequest(CompanyConfig.api.endpoints.deleteOffer(offerId), {
      //   method: 'DELETE',
      // });

      // Eliminar localmente por ahora
      this.offers = this.offers.filter(o => o.id !== offerId);

      CompanyUI.showLoader(false);
      CompanyUI.showToast(CompanyConfig.messages.success.deleted, 'success');
      
      // Re-renderizar si estamos en la vista de ofertas
      if (CompanyRouter.currentView === 'offers') {
        CompanyRouter.renderOffersView();
      }
    } catch (error) {
      console.error('Error al eliminar oferta:', error);
      CompanyUI.showToast(CompanyConfig.messages.errors.server, 'error');
      CompanyUI.showLoader(false);
    }
  },

  /**
   * Crear nueva oferta
   * @param {Object} offerData - Datos de la nueva oferta
   */
  async createOffer(offerData) {
    try {
      CompanyUI.showLoader(true);

      // TODO: Llamada real a la API
      // const newOffer = await apiRequest(CompanyConfig.api.endpoints.createOffer, {
      //   method: 'POST',
      //   body: JSON.stringify(offerData),
      // });

      // Crear localmente por ahora
      const newOffer = {
        id: this.offers.length + 1,
        ...offerData,
        applicants: 0,
        createdDate: new Date().toISOString().split('T')[0],
      };
      this.offers.push(newOffer);

      CompanyUI.showLoader(false);
      CompanyUI.showToast(CompanyConfig.messages.success.created, 'success');
      
      // Navegar a la vista de ofertas
      CompanyRouter.navigate('/ofertas');
    } catch (error) {
      console.error('Error al crear oferta:', error);
      CompanyUI.showToast(CompanyConfig.messages.errors.server, 'error');
      CompanyUI.showLoader(false);
    }
  },
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CompanyOffers.init());
} else {
  CompanyOffers.init();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompanyOffers;
}
