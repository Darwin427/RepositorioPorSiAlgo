/**
 * CompanyApplicants.js
 * Gestión de postulantes a las ofertas de la empresa
 */

const CompanyApplicants = {
  /**
   * Postulantes cargados actualmente
   */
  applicants: [],

  /**
   * Filtros activos
   */
  filters: {
    offerId: 'all', // ID de oferta o 'all'
    status: 'all', // all, new, reviewing, accepted, rejected
    search: '',
  },

  /**
   * Inicializa el módulo de postulantes
   */
  init() {
    this.loadApplicants();
    console.log('CompanyApplicants inicializado');
  },

  /**
   * Carga los postulantes desde la API o datos mock
   */
  async loadApplicants() {
    try {
      CompanyUI.showLoader(true);
      
      // TODO: Reemplazar con llamada real a la API
      // const data = await apiRequest(CompanyConfig.api.endpoints.applicants('all'));
      // this.applicants = data;
      
      // Datos mock por ahora
      this.applicants = this.getMockApplicants();
      
      CompanyUI.showLoader(false);
    } catch (error) {
      console.error('Error al cargar postulantes:', error);
      CompanyUI.showToast(CompanyConfig.messages.errors.network, 'error');
      CompanyUI.showLoader(false);
    }
  },

  /**
   * Obtiene postulantes mock para desarrollo
   * @returns {Array} Array de postulantes
   */
  getMockApplicants() {
    return [
      {
        id: 1,
        name: 'Juan Pérez García',
        email: 'juan.perez@example.com',
        phone: '300-123-4567',
        offerId: 1,
        offerTitle: 'Desarrollador Web Frontend',
        status: 'new',
        applicationDate: '2025-10-05',
        program: 'Ingeniería de Sistemas',
        semester: 8,
        cv: '/files/cv_juan_perez.pdf',
        notes: '',
      },
      {
        id: 2,
        name: 'María García López',
        email: 'maria.garcia@example.com',
        phone: '301-234-5678',
        offerId: 2,
        offerTitle: 'Diseñador UI/UX',
        status: 'reviewing',
        applicationDate: '2025-10-04',
        program: 'Diseño Gráfico',
        semester: 7,
        cv: '/files/cv_maria_garcia.pdf',
        notes: 'Excelente portafolio',
      },
      {
        id: 3,
        name: 'Carlos López Martínez',
        email: 'carlos.lopez@example.com',
        phone: '302-345-6789',
        offerId: 1,
        offerTitle: 'Desarrollador Web Frontend',
        status: 'new',
        applicationDate: '2025-10-03',
        program: 'Ingeniería de Sistemas',
        semester: 9,
        cv: '/files/cv_carlos_lopez.pdf',
        notes: '',
      },
      {
        id: 4,
        name: 'Ana Martínez Rodríguez',
        email: 'ana.martinez@example.com',
        phone: '303-456-7890',
        offerId: 2,
        offerTitle: 'Diseñador UI/UX',
        status: 'accepted',
        applicationDate: '2025-10-02',
        program: 'Diseño Gráfico',
        semester: 8,
        cv: '/files/cv_ana_martinez.pdf',
        notes: 'Aceptada para entrevista',
      },
      {
        id: 5,
        name: 'Pedro Sánchez Gómez',
        email: 'pedro.sanchez@example.com',
        phone: '304-567-8901',
        offerId: 1,
        offerTitle: 'Desarrollador Web Frontend',
        status: 'rejected',
        applicationDate: '2025-09-30',
        program: 'Ingeniería de Sistemas',
        semester: 6,
        cv: '/files/cv_pedro_sanchez.pdf',
        notes: 'No cumple con requisitos mínimos',
      },
    ];
  },

  /**
   * Obtiene estadísticas de los postulantes
   * @returns {Object} Estadísticas
   */
  getStats() {
    return {
      total: this.applicants.length,
      new: this.applicants.filter(a => a.status === 'new').length,
      reviewing: this.applicants.filter(a => a.status === 'reviewing').length,
      accepted: this.applicants.filter(a => a.status === 'accepted').length,
      rejected: this.applicants.filter(a => a.status === 'rejected').length,
    };
  },

  /**
   * Filtra los postulantes según los filtros activos
   * @returns {Array} Postulantes filtrados
   */
  getFilteredApplicants() {
    let filtered = [...this.applicants];

    // Filtrar por oferta
    if (this.filters.offerId !== 'all') {
      filtered = filtered.filter(a => a.offerId === parseInt(this.filters.offerId));
    }

    // Filtrar por estado
    if (this.filters.status !== 'all') {
      filtered = filtered.filter(a => a.status === this.filters.status);
    }

    // Filtrar por búsqueda
    if (this.filters.search) {
      const search = this.filters.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(search) ||
        a.email.toLowerCase().includes(search) ||
        a.offerTitle.toLowerCase().includes(search) ||
        a.program.toLowerCase().includes(search)
      );
    }

    return filtered;
  },

  /**
   * Renderiza la tabla de postulantes
   * @param {string} containerId - ID del contenedor
   */
  renderApplicantsTable(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const applicants = this.getFilteredApplicants();

    if (applicants.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <p>No se encontraron postulantes</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <table class="company-table">
        <thead class="company-table__header">
          <tr>
            <th class="company-table__header-cell">Nombre</th>
            <th class="company-table__header-cell">Oferta</th>
            <th class="company-table__header-cell">Programa</th>
            <th class="company-table__header-cell">Fecha Postulación</th>
            <th class="company-table__header-cell">Estado</th>
            <th class="company-table__header-cell">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${applicants.map(applicant => this.renderApplicantRow(applicant)).join('')}
        </tbody>
      </table>
    `;
  },

  /**
   * Renderiza una fila de postulante
   * @param {Object} applicant - Datos del postulante
   * @returns {string} HTML de la fila
   */
  renderApplicantRow(applicant) {
    const statusBadge = this.getStatusBadge(applicant.status);

    return `
      <tr class="company-table__row">
        <td class="company-table__cell">
          <div style="font-weight: 500;">${applicant.name}</div>
          <div style="font-size: 0.875rem; color: #666;">${applicant.email}</div>
        </td>
        <td class="company-table__cell">${applicant.offerTitle}</td>
        <td class="company-table__cell">
          <div>${applicant.program}</div>
          <div style="font-size: 0.875rem; color: #666;">Semestre ${applicant.semester}</div>
        </td>
        <td class="company-table__cell">${applicant.applicationDate}</td>
        <td class="company-table__cell">${statusBadge}</td>
        <td class="company-table__cell">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button 
              class="company-button company-button--sm company-button--primary"
              onclick="CompanyApplicants.viewProfile(${applicant.id})"
              style="min-width: 90px;"
            >
              Ver Perfil
            </button>
            <button 
              class="company-button company-button--sm company-button--outline"
              onclick="CompanyApplicants.contactApplicant(${applicant.id})"
              style="min-width: 90px;"
            >
              Contactar
            </button>
            ${applicant.status === 'new' ? `
              <button 
                class="company-button company-button--sm company-button--warning"
                onclick="CompanyApplicants.updateStatus(${applicant.id}, 'reviewing')"
                style="min-width: 90px;"
              >
                👁️ Revisar
              </button>
            ` : ''}
            ${applicant.status === 'new' || applicant.status === 'reviewing' ? `
              <button 
                class="company-button company-button--sm company-button--success"
                onclick="CompanyApplicants.updateStatus(${applicant.id}, 'accepted')"
                style="min-width: 80px;"
              >
                ✓ Aceptar
              </button>
              <button 
                class="company-button company-button--sm company-button--error"
                onclick="CompanyApplicants.updateStatus(${applicant.id}, 'rejected')"
                style="min-width: 80px;"
              >
                ✕ Rechazar
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  },

  /**
   * Obtiene el badge HTML según el estado
   * @param {string} status - Estado del postulante
   * @returns {string} HTML del badge
   */
  getStatusBadge(status) {
    const badges = {
      new: '<span class="company-badge company-badge--info">Nuevo</span>',
      reviewing: '<span class="company-badge company-badge--warning">En Revisión</span>',
      accepted: '<span class="company-badge company-badge--success">Aceptado</span>',
      rejected: '<span class="company-badge company-badge--error">Rechazado</span>',
    };
    return badges[status] || badges.new;
  },

  /**
   * Ver perfil completo de un postulante
   * @param {number} applicantId - ID del postulante
   */
  async viewProfile(applicantId) {
    const applicant = this.applicants.find(a => a.id === applicantId);
    if (!applicant) {
      CompanyUI.showToast('Postulante no encontrado', 'error');
      return;
    }

    // Crear modal de perfil
    this.showProfileModal(applicant);
  },

  /**
   * Muestra modal con el perfil del postulante
   * @param {Object} applicant - Datos del postulante
   */
  showProfileModal(applicant) {
    // Crear modal si no existe
    let modal = document.getElementById('applicantProfileModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'applicantProfileModal';
      modal.className = 'company-modal';
      document.body.appendChild(modal);
    }

    const statusBadge = this.getStatusBadge(applicant.status);

    modal.innerHTML = `
      <div class="company-modal__backdrop" onclick="CompanyApplicants.closeProfileModal()"></div>
      <div class="company-modal__content" style="max-width: 700px; margin: 37px auto 20px auto;">
        <div class="company-modal__header">
          <h3 class="company-modal__title">Perfil del Postulante</h3>
          <button class="company-modal__close" onclick="CompanyApplicants.closeProfileModal()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="company-modal__body" style="padding: 24px;">
          <div style="margin-bottom: 24px; text-align: center; padding-bottom: 20px; border-bottom: 2px solid #e0e0e0;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #003E7E 0%, #005DAA 100%); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; margin: 0 auto 12px;">
              ${applicant.name.charAt(0).toUpperCase()}
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 1.5rem; color: #1b1b1f;">${applicant.name}</h2>
            <div style="margin-bottom: 8px;">${statusBadge}</div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
            <div>
              <div style="font-weight: 600; color: #666; font-size: 0.875rem; margin-bottom: 4px;">Email</div>
              <div style="color: #1b1b1f;">${applicant.email}</div>
            </div>
            <div>
              <div style="font-weight: 600; color: #666; font-size: 0.875rem; margin-bottom: 4px;">Teléfono</div>
              <div style="color: #1b1b1f;">${applicant.phone}</div>
            </div>
            <div>
              <div style="font-weight: 600; color: #666; font-size: 0.875rem; margin-bottom: 4px;">Programa</div>
              <div style="color: #1b1b1f;">${applicant.program}</div>
            </div>
            <div>
              <div style="font-weight: 600; color: #666; font-size: 0.875rem; margin-bottom: 4px;">Semestre</div>
              <div style="color: #1b1b1f;">${applicant.semester}</div>
            </div>
          </div>

          <div style="margin-bottom: 24px; padding: 16px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #003E7E;">
            <div style="font-weight: 600; color: #003E7E; margin-bottom: 8px;">Oferta Postulada</div>
            <div style="color: #1b1b1f; font-size: 1.1rem;">${applicant.offerTitle}</div>
            <div style="color: #666; font-size: 0.875rem; margin-top: 4px;">Fecha de postulación: ${applicant.applicationDate}</div>
          </div>

          ${applicant.notes ? `
            <div style="margin-bottom: 24px;">
              <div style="font-weight: 600; color: #666; margin-bottom: 8px;">Notas</div>
              <div style="padding: 12px; background: #fff3e0; border-radius: 8px; color: #1b1b1f; line-height: 1.6;">
                ${applicant.notes}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="company-modal__footer">
          <button class="company-button company-button--ghost" onclick="CompanyApplicants.closeProfileModal()">
            Cerrar
          </button>
          <a href="${applicant.cv}" target="_blank" class="company-button company-button--outline" style="text-decoration: none;">
            📄 Descargar CV
          </a>
          <button class="company-button company-button--primary" onclick="CompanyApplicants.closeProfileModal(); CompanyApplicants.contactApplicant(${applicant.id});">
            ✉️ Contactar
          </button>
        </div>
      </div>
    `;

    // Mostrar modal
    modal.classList.add('company-modal--open');
    document.body.style.overflow = 'hidden';
  },

  /**
   * Cierra el modal de perfil
   */
  closeProfileModal() {
    const modal = document.getElementById('applicantProfileModal');
    if (modal) {
      modal.classList.remove('company-modal--open');
      document.body.style.overflow = '';
    }
  },

  /**
   * Contactar a un postulante
   * @param {number} applicantId - ID del postulante
   */
  async contactApplicant(applicantId) {
    const applicant = this.applicants.find(a => a.id === applicantId);
    if (!applicant) {
      CompanyUI.showToast('Postulante no encontrado', 'error');
      return;
    }

    // TODO: Implementar modal de contacto o abrir cliente de correo
    const mailtoLink = `mailto:${applicant.email}?subject=Respuesta a tu postulación - ${applicant.offerTitle}`;
    window.location.href = mailtoLink;
    
    CompanyUI.showToast(`Abriendo cliente de correo para: ${applicant.name}`, 'info');
  },

  /**
   * Actualizar estado de un postulante
   * @param {number} applicantId - ID del postulante
   * @param {string} newStatus - Nuevo estado
   */
  async updateStatus(applicantId, newStatus) {
    const applicant = this.applicants.find(a => a.id === applicantId);
    if (!applicant) {
      CompanyUI.showToast('Postulante no encontrado', 'error');
      return;
    }

    const statusNames = {
      new: 'Nuevo',
      reviewing: 'En Revisión',
      accepted: 'Aceptado',
      rejected: 'Rechazado',
    };

    const confirmed = await CompanyUI.confirm(
      `El postulante ${applicant.name} será marcado como "${statusNames[newStatus]}".`,
      {
        title: '¿Cambiar estado del postulante?',
        confirmText: 'Cambiar Estado',
        cancelText: 'Cancelar',
        type: newStatus === 'rejected' ? 'warning' : 'info',
      }
    );
    if (!confirmed) return;

    try {
      CompanyUI.showLoader(true);

      // TODO: Llamada real a la API
      // await apiRequest(
      //   CompanyConfig.api.endpoints.applicantDetail(applicant.offerId, applicantId),
      //   {
      //     method: 'PATCH',
      //     body: JSON.stringify({ status: newStatus }),
      //   }
      // );

      // Actualizar localmente por ahora
      applicant.status = newStatus;

      CompanyUI.showLoader(false);
      CompanyUI.showToast('Estado actualizado exitosamente', 'success');
      
      // Re-renderizar si estamos en la vista de postulantes
      if (CompanyRouter.currentView === 'applicants') {
        CompanyRouter.renderApplicantsView();
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      CompanyUI.showToast(CompanyConfig.messages.errors.server, 'error');
      CompanyUI.showLoader(false);
    }
  },

  /**
   * Agregar nota a un postulante
   * @param {number} applicantId - ID del postulante
   * @param {string} note - Nota a agregar
   */
  async addNote(applicantId, note) {
    const applicant = this.applicants.find(a => a.id === applicantId);
    if (!applicant) {
      CompanyUI.showToast('Postulante no encontrado', 'error');
      return;
    }

    try {
      CompanyUI.showLoader(true);

      // TODO: Llamada real a la API
      // await apiRequest(
      //   CompanyConfig.api.endpoints.applicantDetail(applicant.offerId, applicantId),
      //   {
      //     method: 'PATCH',
      //     body: JSON.stringify({ notes: note }),
      //   }
      // );

      // Actualizar localmente por ahora
      applicant.notes = note;

      CompanyUI.showLoader(false);
      CompanyUI.showToast('Nota agregada exitosamente', 'success');
    } catch (error) {
      console.error('Error al agregar nota:', error);
      CompanyUI.showToast(CompanyConfig.messages.errors.server, 'error');
      CompanyUI.showLoader(false);
    }
  },

  /**
   * Exportar lista de postulantes a CSV
   */
  exportToCSV() {
    const applicants = this.getFilteredApplicants();
    
    if (applicants.length === 0) {
      CompanyUI.showToast('No hay postulantes para exportar', 'warning');
      return;
    }

    // Crear CSV
    const headers = ['Nombre', 'Email', 'Teléfono', 'Oferta', 'Programa', 'Semestre', 'Estado', 'Fecha'];
    const rows = applicants.map(a => [
      a.name,
      a.email,
      a.phone,
      a.offerTitle,
      a.program,
      a.semester,
      a.status,
      a.applicationDate,
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `postulantes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    CompanyUI.showToast('Archivo CSV descargado', 'success');
  },
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CompanyApplicants.init());
} else {
  CompanyApplicants.init();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompanyApplicants;
}
