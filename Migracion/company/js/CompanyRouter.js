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
   * Navega a la vista de postulantes con un filtro de oferta específico
   * @param {number} offerId - ID de la oferta para filtrar
   */
  navigateToApplicantsWithFilter(offerId) {
    // Navegar a postulantes
    this.navigate('/postulantes');
    
    // Aplicar filtro después de un pequeño delay para asegurar que la vista esté renderizada
    setTimeout(() => {
      const filterSelect = document.getElementById('filterOfferId');
      if (filterSelect) {
        filterSelect.value = offerId.toString();
        // Disparar el evento de cambio para aplicar el filtro
        this.handleApplicantFilter();
      }
    }, 100);
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

    // Verificar si es una ruta de edición
    if (route.startsWith('/ofertas/editar/')) {
      return 'editOffer';
    }

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
      editOffer: this.renderEditOfferView,
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
    const stats = CompanyOffers.getStats();
    
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
              <div class="company-card__value">${stats.active}</div>
              <div class="company-card__label">Ofertas Activas</div>
            </div>
          </div>
          <div class="company-card">
            <div class="company-card__body">
              <div class="company-card__value">${stats.drafts}</div>
              <div class="company-card__label">Borradores</div>
            </div>
          </div>
          <div class="company-card">
            <div class="company-card__body">
              <div class="company-card__value">${stats.totalApplicants}</div>
              <div class="company-card__label">Total Postulantes</div>
            </div>
          </div>
          <div class="company-card">
            <div class="company-card__body">
              <div class="company-card__value">${stats.closed}</div>
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
        <div class="company-card__body" id="companyOffersTableContainer">
          <!-- Generado dinámicamente por CompanyOffers.js -->
        </div>
      </section>
    `;

    // Renderizar tabla de ofertas
    if (typeof CompanyOffers !== 'undefined') {
      CompanyOffers.renderOffersTable('companyOffersTableContainer');
    }
  },

  /**
   * Renderiza la vista de Nueva Oferta
   */
  renderNewOfferView() {
    this.viewContainer.innerHTML = `
      <!-- Encabezado -->
      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 1.75rem; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
          Crear Nueva Oferta de Prácticas
        </h2>
        <p style="color: #e6e6e9; font-size: 1rem;">
          Completa la información de la oferta. Los campos marcados con <span style="color: #ff5252;">*</span> son obligatorios.
        </p>
      </div>

      <form id="newOfferForm">
        <div class="company-grid company-grid--cols-1" style="gap: 24px;">
          
          <!-- Información Básica -->
          <div class="company-card">
            <div class="company-card__header" style="border-bottom: 3px solid #003E7E; padding-bottom: 16px;">
              <h3 style="font-size: 1.25rem; font-weight: 600; color: #003E7E; display: flex; align-items: center; gap: 10px; margin: 0;">
                <span style="background: #003E7E; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">1</span>
                Información Básica
              </h3>
            </div>
            <div class="company-card__body" style="padding: 28px;">
              <div class="company-grid company-grid--cols-2" style="gap: 20px;">
                <div class="company-form-group">
                  <label class="company-form-label" style="font-weight: 600; color: #1b1b1f; margin-bottom: 8px;">
                    Título de la oferta <span style="color: #f44336;">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="offerTitle" 
                    class="company-form-input" 
                    placeholder="Ej: Desarrollador Web Frontend" 
                    required>
                  <small style="color: #666; font-size: 0.875rem; margin-top: 6px; display: block;">
                    Usa un título claro y descriptivo
                  </small>
                </div>
                
                <div class="company-form-group">
                  <label class="company-form-label" style="font-weight: 600; color: #1b1b1f; margin-bottom: 8px;">
                    Área <span style="color: #f44336;">*</span>
                  </label>
                  <select id="offerArea" class="company-form-select" required>
                    <option value="">Selecciona un área</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Diseño">Diseño</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Administración">Administración</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div class="company-form-group" style="margin-top: 20px;">
                <label class="company-form-label" style="font-weight: 600; color: #1b1b1f; margin-bottom: 8px;">
                  Descripción de la oferta <span style="color: #f44336;">*</span>
                </label>
                <textarea 
                  id="offerDescription" 
                  class="company-form-textarea" 
                  rows="5" 
                  placeholder="Describe las responsabilidades, el perfil que buscas y qué aprenderá el estudiante..."
                  required></textarea>
                <small style="color: #666; font-size: 0.875rem; margin-top: 6px; display: block;">
                  Mínimo 20 caracteres. Sé específico sobre las tareas y aprendizajes.
                </small>
              </div>
            </div>
          </div>

          <!-- Detalles de la Práctica -->
          <div class="company-card">
            <div class="company-card__header" style="border-bottom: 3px solid #FFC20E; padding-bottom: 16px;">
              <h3 style="font-size: 1.25rem; font-weight: 600; color: #E6A800; display: flex; align-items: center; gap: 10px; margin: 0;">
                <span style="background: #FFC20E; color: #1b1b1f; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">2</span>
                Detalles de la Práctica
              </h3>
            </div>
            <div class="company-card__body" style="padding: 28px;">
              <div class="company-grid company-grid--cols-3" style="gap: 20px;">
                <div class="company-form-group">
                  <label class="company-form-label" style="font-weight: 600; color: #1b1b1f; margin-bottom: 8px;">
                    Duración (meses) <span style="color: #f44336;">*</span>
                  </label>
                  <input 
                    type="number" 
                    id="offerDuration" 
                    class="company-form-input" 
                    placeholder="6" 
                    min="1" 
                    max="24" 
                    required>
                  <small style="color: #666; font-size: 0.875rem; margin-top: 6px; display: block;">
                    Entre 1 y 24 meses
                  </small>
                </div>
                
                <div class="company-form-group">
                  <label class="company-form-label" style="font-weight: 600; color: #1b1b1f; margin-bottom: 8px;">
                    Modalidad <span style="color: #f44336;">*</span>
                  </label>
                  <select id="offerModality" class="company-form-select" required>
                    <option value="">Selecciona modalidad</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>

                <div class="company-form-group">
                  <label class="company-form-label" style="font-weight: 600; color: #1b1b1f; margin-bottom: 8px;">
                    Vacantes <span style="color: #f44336;">*</span>
                  </label>
                  <input 
                    type="number" 
                    id="offerVacancies" 
                    class="company-form-input" 
                    placeholder="1" 
                    min="1" 
                    max="50" 
                    required>
                  <small style="color: #666; font-size: 0.875rem; margin-top: 6px; display: block;">
                    Cupos disponibles
                  </small>
                </div>
              </div>
            </div>
          </div>

          <!-- Requisitos -->
          <div class="company-card">
            <div class="company-card__header" style="border-bottom: 3px solid #4caf50; padding-bottom: 16px;">
              <h3 style="font-size: 1.25rem; font-weight: 600; color: #4caf50; display: flex; align-items: center; gap: 10px; margin: 0;">
                <span style="background: #4caf50; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">3</span>
                Requisitos (Opcional)
              </h3>
            </div>
            <div class="company-card__body" style="padding: 28px;">
              <div class="company-form-group">
                <label class="company-form-label" style="font-weight: 600; color: #1b1b1f; margin-bottom: 8px;">
                  Conocimientos, habilidades y experiencia deseada
                </label>
                <textarea 
                  id="offerRequirements" 
                  class="company-form-textarea" 
                  rows="4" 
                  placeholder="Ejemplo: Conocimientos en JavaScript, React, trabajo en equipo, proactividad..."></textarea>
                <small style="color: #666; font-size: 0.875rem; margin-top: 6px; display: block;">
                  Especifica las habilidades técnicas y blandas que valoras
                </small>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="company-card" style="background: linear-gradient(to bottom, #f8f9fa, #ffffff);">
            <div class="company-card__body" style="padding: 24px;">
              <div style="display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap;">
                <button type="button" class="company-button company-button--ghost company-button--lg" onclick="CompanyRouter.navigate('/ofertas')" style="min-width: 140px;">
                  Cancelar
                </button>
                <button type="button" class="company-button company-button--outline company-button--lg" onclick="CompanyRouter.handleSubmitOffer('draft')" style="min-width: 180px;">
                  Guardar Borrador
                </button>
                <button type="button" class="company-button company-button--primary company-button--lg" onclick="CompanyRouter.handleSubmitOffer('active')" style="min-width: 180px;">
                  Publicar Oferta
                </button>
              </div>
            </div>
          </div>

        </div>
      </form>
    `;
  },

  /**
   * Renderiza la vista de Editar Oferta
   */
  renderEditOfferView() {
    // Obtener ID de la oferta desde la URL
    const route = window.location.hash.substring(1);
    const offerId = parseInt(route.split('/').pop());
    
    // Buscar la oferta
    const offer = CompanyOffers.offers.find(o => o.id === offerId);
    
    if (!offer) {
      CompanyUI.showToast('Oferta no encontrada', 'error');
      this.navigate('/ofertas');
      return;
    }

    this.viewContainer.innerHTML = `
      <section class="company-section">
        <div class="company-section__header">
          <h2 class="company-section__title">Editar Oferta</h2>
        </div>
      </section>

      <section class="company-card">
        <div class="company-card__body">
          <form id="editOfferForm">
            <input type="hidden" id="offerId" value="${offer.id}">
            
            <div class="company-grid company-grid--cols-2">
              <div class="company-form-group">
                <label class="company-form-label">Título de la oferta *</label>
                <input type="text" id="offerTitle" class="company-form-input" value="${offer.title}" required>
              </div>
              
              <div class="company-form-group">
                <label class="company-form-label">Área *</label>
                <select id="offerArea" class="company-form-select" required>
                  <option value="">Selecciona un área</option>
                  <option value="Tecnología" ${offer.area === 'Tecnología' ? 'selected' : ''}>Tecnología</option>
                  <option value="Diseño" ${offer.area === 'Diseño' ? 'selected' : ''}>Diseño</option>
                  <option value="Marketing" ${offer.area === 'Marketing' ? 'selected' : ''}>Marketing</option>
                  <option value="Administración" ${offer.area === 'Administración' ? 'selected' : ''}>Administración</option>
                  <option value="Finanzas" ${offer.area === 'Finanzas' ? 'selected' : ''}>Finanzas</option>
                  <option value="Recursos Humanos" ${offer.area === 'Recursos Humanos' ? 'selected' : ''}>Recursos Humanos</option>
                  <option value="Ventas" ${offer.area === 'Ventas' ? 'selected' : ''}>Ventas</option>
                  <option value="Otro" ${offer.area === 'Otro' ? 'selected' : ''}>Otro</option>
                </select>
              </div>
            </div>

            <div class="company-form-group">
              <label class="company-form-label">Descripción *</label>
              <textarea id="offerDescription" class="company-form-textarea" rows="5" required>${offer.description}</textarea>
            </div>

            <div class="company-grid company-grid--cols-3">
              <div class="company-form-group">
                <label class="company-form-label">Duración (meses) *</label>
                <input type="number" id="offerDuration" class="company-form-input" value="${offer.duration}" min="1" max="24" required>
              </div>
              
              <div class="company-form-group">
                <label class="company-form-label">Modalidad *</label>
                <select id="offerModality" class="company-form-select" required>
                  <option value="">Selecciona modalidad</option>
                  <option value="Presencial" ${offer.modality === 'Presencial' ? 'selected' : ''}>Presencial</option>
                  <option value="Remoto" ${offer.modality === 'Remoto' ? 'selected' : ''}>Remoto</option>
                  <option value="Híbrido" ${offer.modality === 'Híbrido' ? 'selected' : ''}>Híbrido</option>
                </select>
              </div>

              <div class="company-form-group">
                <label class="company-form-label">Vacantes *</label>
                <input type="number" id="offerVacancies" class="company-form-input" value="${offer.vacancies}" min="1" max="50" required>
              </div>
            </div>

            <div class="company-form-group">
              <label class="company-form-label">Requisitos</label>
              <textarea id="offerRequirements" class="company-form-textarea" rows="3">${offer.requirements || ''}</textarea>
            </div>

            <div style="display: flex; gap: 16px; margin-top: 24px;">
              <button type="button" class="company-button company-button--primary" onclick="CompanyRouter.handleUpdateOffer()">
                Guardar Cambios
              </button>
              <button type="button" class="company-button company-button--ghost" onclick="CompanyRouter.navigate('/ofertas')">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>
    `;
  },

  /**
   * Maneja el envío del formulario de oferta
   * @param {string} status - Estado de la oferta ('active' o 'draft')
   */
  async handleSubmitOffer(status) {
    const form = document.getElementById('newOfferForm');
    
    // Validar formulario
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Obtener datos del formulario
    const offerData = {
      title: document.getElementById('offerTitle').value.trim(),
      area: document.getElementById('offerArea').value,
      description: document.getElementById('offerDescription').value.trim(),
      duration: parseInt(document.getElementById('offerDuration').value),
      modality: document.getElementById('offerModality').value,
      vacancies: parseInt(document.getElementById('offerVacancies').value),
      requirements: document.getElementById('offerRequirements').value.trim(),
      status: status,
      publishedDate: status === 'active' ? new Date().toISOString().split('T')[0] : null,
    };

    // Validaciones adicionales
    if (offerData.title.length < 5) {
      CompanyUI.showToast('El título debe tener al menos 5 caracteres', 'warning');
      return;
    }

    if (offerData.description.length < 20) {
      CompanyUI.showToast('La descripción debe tener al menos 20 caracteres', 'warning');
      return;
    }

    // Crear oferta
    await CompanyOffers.createOffer(offerData);
  },

  /**
   * Maneja la actualización de una oferta
   */
  async handleUpdateOffer() {
    const form = document.getElementById('editOfferForm');
    
    // Validar formulario
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Obtener datos del formulario
    const offerId = parseInt(document.getElementById('offerId').value);
    const offerData = {
      title: document.getElementById('offerTitle').value.trim(),
      area: document.getElementById('offerArea').value,
      description: document.getElementById('offerDescription').value.trim(),
      duration: parseInt(document.getElementById('offerDuration').value),
      modality: document.getElementById('offerModality').value,
      vacancies: parseInt(document.getElementById('offerVacancies').value),
      requirements: document.getElementById('offerRequirements').value.trim(),
    };

    // Validaciones adicionales
    if (offerData.title.length < 5) {
      CompanyUI.showToast('El título debe tener al menos 5 caracteres', 'warning');
      return;
    }

    if (offerData.description.length < 20) {
      CompanyUI.showToast('La descripción debe tener al menos 20 caracteres', 'warning');
      return;
    }

    // Actualizar oferta
    await CompanyOffers.updateOffer(offerId, offerData);
  },

  /**
   * Renderiza la vista de Postulantes
   */
  renderApplicantsView() {
    const stats = CompanyApplicants.getStats();
    
    this.viewContainer.innerHTML = `
      <!-- Encabezado -->
      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 1.75rem; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
          Gestión de Postulantes
        </h2>
        <p style="color: #e6e6e9; font-size: 1rem;">
          Revisa y gestiona las postulaciones recibidas para tus ofertas de prácticas.
        </p>
      </div>

      <!-- Estadísticas -->
      <div class="company-card" style="margin-bottom: 24px;">
        <div class="company-card__body" style="padding: 24px;">
          <div style="display: flex; justify-content: space-around; align-items: center; gap: 40px;">
            <div style="text-align: center;">
              <div style="font-size: 2.25rem; font-weight: 700; color: #1b1b1f; margin-bottom: 6px;">${stats.total}</div>
              <div style="font-size: 0.875rem; color: #666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Total</div>
            </div>
            <div style="width: 2px; height: 50px; background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1), transparent);"></div>
            <div style="text-align: center;">
              <div style="font-size: 2.25rem; font-weight: 700; color: #2196f3; margin-bottom: 6px;">${stats.new}</div>
              <div style="font-size: 0.875rem; color: #666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Nuevos</div>
            </div>
            <div style="width: 2px; height: 50px; background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1), transparent);"></div>
            <div style="text-align: center;">
              <div style="font-size: 2.25rem; font-weight: 700; color: #ff9800; margin-bottom: 6px;">${stats.reviewing}</div>
              <div style="font-size: 0.875rem; color: #666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">En Revisión</div>
            </div>
            <div style="width: 2px; height: 50px; background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1), transparent);"></div>
            <div style="text-align: center;">
              <div style="font-size: 2.25rem; font-weight: 700; color: #4caf50; margin-bottom: 6px;">${stats.accepted}</div>
              <div style="font-size: 0.875rem; color: #666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Aceptados</div>
            </div>
            <div style="width: 2px; height: 50px; background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1), transparent);"></div>
            <div style="text-align: center;">
              <div style="font-size: 2.25rem; font-weight: 700; color: #f44336; margin-bottom: 6px;">${stats.rejected}</div>
              <div style="font-size: 0.875rem; color: #666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Rechazados</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="company-card" style="margin-bottom: 24px;">
        <div class="company-card__header" style="border-bottom: 3px solid #FFC20E; padding-bottom: 16px;">
          <h3 style="font-size: 1.25rem; font-weight: 600; color: #E6A800; margin: 0;">
            Filtros de Búsqueda
          </h3>
        </div>
        <div class="company-card__body" style="padding: 28px;">
          <div class="company-grid company-grid--cols-4" style="gap: 20px;">
            <div class="company-form-group">
              <label class="company-form-label" style="font-weight: 600; color: #1b1b1f; margin-bottom: 8px;">
                Filtrar por oferta
              </label>
              <select class="company-form-select" id="filterOfferId" onchange="CompanyRouter.handleApplicantFilter()">
                <option value="all">Todas las ofertas</option>
                ${CompanyOffers.offers.filter(o => o.status === 'active').map(o => `
                  <option value="${o.id}">${o.title}</option>
                `).join('')}
              </select>
            </div>
            <div class="company-form-group">
              <label class="company-form-label" style="font-weight: 600; color: #1b1b1f; margin-bottom: 8px;">
                Estado
              </label>
              <select class="company-form-select" id="filterStatus" onchange="CompanyRouter.handleApplicantFilter()">
                <option value="all">Todos los estados</option>
                <option value="new">Nuevos</option>
                <option value="reviewing">En revisión</option>
                <option value="accepted">Aceptados</option>
                <option value="rejected">Rechazados</option>
              </select>
            </div>
            <div class="company-form-group">
              <label class="company-form-label" style="font-weight: 600; color: #1b1b1f; margin-bottom: 8px;">
                Buscar
              </label>
              <input type="text" class="company-form-input" id="filterSearch" placeholder="Nombre, email, programa..." onkeyup="CompanyRouter.handleApplicantFilter()">
            </div>
            <div class="company-form-group" style="display: flex; align-items: flex-end;">
              <button class="company-button company-button--primary company-button--full" onclick="CompanyApplicants.exportToCSV()" style="height: 44px;">
                📥 Exportar CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de postulantes -->
      <div class="company-card">
        <div class="company-card__header" style="border-bottom: 3px solid #81c784; padding-bottom: 16px;">
          <h3 style="font-size: 1.25rem; font-weight: 600; color: #81c784; margin: 0;">
            Lista de Postulantes
          </h3>
        </div>
        <div class="company-card__body" style="padding: 0;" id="companyApplicantsTableContainer">
          <!-- Generado dinámicamente por CompanyApplicants.js -->
        </div>
      </div>
    `;

    // Renderizar tabla de postulantes
    if (typeof CompanyApplicants !== 'undefined') {
      CompanyApplicants.renderApplicantsTable('companyApplicantsTableContainer');
    }
  },

  /**
   * Maneja los filtros de postulantes
   */
  handleApplicantFilter() {
    const offerId = document.getElementById('filterOfferId')?.value || 'all';
    const status = document.getElementById('filterStatus')?.value || 'all';
    const search = document.getElementById('filterSearch')?.value || '';

    // Actualizar filtros en CompanyApplicants
    if (typeof CompanyApplicants !== 'undefined') {
      CompanyApplicants.filters.offerId = offerId;
      CompanyApplicants.filters.status = status;
      CompanyApplicants.filters.search = search;
      CompanyApplicants.renderApplicantsTable('companyApplicantsTableContainer');
    }
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
