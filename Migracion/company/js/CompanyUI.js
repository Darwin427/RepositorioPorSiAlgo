/**
 * CompanyUI.js
 * Manejo de interacciones de UI: Sidebar, Modales, Animaciones
 */

const CompanyUI = {
  /**
   * Estado del sidebar (abierto/cerrado en móvil)
   */
  sidebarOpen: false,

  /**
   * Inicializa todos los event listeners de la UI
   */
  init() {
    this.initSidebar();
    this.initModals();
    this.initResponsive();
    this.initAnimations();
    console.log('CompanyUI inicializado');
  },

  /**
   * Inicializa funcionalidad del sidebar
   */
  initSidebar() {
    const menuToggle = document.getElementById('companyMenuToggle');
    const sidebar = document.querySelector('.company-sidebar');
    const overlay = document.querySelector('.company-overlay');
    const menuItems = document.querySelectorAll('.company-sidebar__menu-item');

    // Toggle sidebar en móvil
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }

    // Cerrar sidebar al hacer click en overlay
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.closeSidebar();
      });
    }

    // Manejar clicks en items del menú
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const route = item.dataset.route;
        if (route) {
          e.preventDefault();
          this.handleMenuItemClick(item, route);
        }
      });
    });

    // Cerrar sidebar en móvil después de seleccionar un item
    if (window.innerWidth <= CompanyConfig.ui.breakpoints.tablet) {
      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          this.closeSidebar();
        });
      });
    }
  },

  /**
   * Abre/cierra el sidebar
   */
  toggleSidebar() {
    const sidebar = document.querySelector('.company-sidebar');
    const overlay = document.querySelector('.company-overlay');

    this.sidebarOpen = !this.sidebarOpen;

    if (this.sidebarOpen) {
      sidebar?.classList.add('company-sidebar--open');
      overlay?.classList.add('company-overlay--visible');
      document.body.style.overflow = 'hidden';
    } else {
      sidebar?.classList.remove('company-sidebar--open');
      overlay?.classList.remove('company-overlay--visible');
      document.body.style.overflow = '';
    }
  },

  /**
   * Cierra el sidebar
   */
  closeSidebar() {
    const sidebar = document.querySelector('.company-sidebar');
    const overlay = document.querySelector('.company-overlay');

    this.sidebarOpen = false;
    sidebar?.classList.remove('company-sidebar--open');
    overlay?.classList.remove('company-overlay--visible');
    document.body.style.overflow = '';
  },

  /**
   * Maneja el click en un item del menú
   * @param {HTMLElement} item - Elemento del menú clickeado
   * @param {string} route - Ruta a navegar
   */
  handleMenuItemClick(item, route) {
    // Remover clase active de todos los items
    document.querySelectorAll('.company-sidebar__menu-item').forEach(menuItem => {
      menuItem.classList.remove('company-sidebar__menu-item--active');
    });

    // Agregar clase active al item clickeado
    item.classList.add('company-sidebar__menu-item--active');

    // Navegar a la ruta (manejado por CompanyRouter)
    if (typeof CompanyRouter !== 'undefined') {
      CompanyRouter.navigate(route);
    }
  },

  /**
   * Inicializa funcionalidad de modales
   */
  initModals() {
    // Cerrar modales al hacer click en backdrop
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('company-modal__backdrop')) {
        const modal = e.target.closest('.company-modal');
        this.closeModal(modal);
      }
    });

    // Cerrar modales con botón de cerrar
    document.querySelectorAll('.company-modal__close').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        const modal = e.target.closest('.company-modal');
        this.closeModal(modal);
      });
    });

    // Cerrar modales con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.company-modal--open');
        if (openModal) {
          this.closeModal(openModal);
        }
      }
    });
  },

  /**
   * Abre un modal
   * @param {string} modalId - ID del modal a abrir
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('company-modal--open');
      document.body.style.overflow = 'hidden';
    }
  },

  /**
   * Cierra un modal
   * @param {HTMLElement|string} modal - Elemento del modal o ID
   */
  closeModal(modal) {
    const modalElement = typeof modal === 'string' 
      ? document.getElementById(modal) 
      : modal;
    
    if (modalElement) {
      modalElement.classList.remove('company-modal--open');
      document.body.style.overflow = '';
    }
  },

  /**
   * Inicializa comportamiento responsive
   */
  initResponsive() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Ejecutar una vez al cargar
    this.handleResize();
  },

  /**
   * Maneja cambios en el tamaño de la ventana
   */
  handleResize() {
    const width = window.innerWidth;

    // Cerrar sidebar automáticamente en desktop
    if (width > CompanyConfig.ui.breakpoints.tablet) {
      this.closeSidebar();
    }

    // Ajustar búsqueda en appbar
    const searchInput = document.querySelector('.company-appbar__search');
    if (searchInput) {
      if (width <= CompanyConfig.ui.breakpoints.mobile) {
        searchInput.style.display = 'none';
      } else {
        searchInput.style.display = '';
      }
    }
  },

  /**
   * Inicializa animaciones de entrada
   */
  initAnimations() {
    // Animar cards al cargar
    const cards = document.querySelectorAll('.company-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 50);
    });
  },

  /**
   * Muestra una notificación toast
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duración en ms (default: 3000)
   */
  showToast(message, type = 'info', duration = 3000) {
    // Crear contenedor de toasts si no existe
    let toastContainer = document.getElementById('companyToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'companyToastContainer';
      toastContainer.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: ${CompanyConfig.ui.breakpoints.wide};
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(toastContainer);
    }

    // Crear toast
    const toast = document.createElement('div');
    toast.className = `company-toast company-toast--${type}`;
    toast.style.cssText = `
      background: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 300px;
      max-width: 400px;
      animation: slideInFromRight 0.3s ease;
      border-left: 4px solid ${this.getToastColor(type)};
    `;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Auto-remover después de la duración
    setTimeout(() => {
      toast.style.animation = 'slideInFromRight 0.3s ease reverse';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  },

  /**
   * Obtiene el color según el tipo de toast
   * @param {string} type - Tipo de toast
   * @returns {string} Color hexadecimal
   */
  getToastColor(type) {
    const colors = {
      success: '#4caf50',
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196f3',
    };
    return colors[type] || colors.info;
  },

  /**
   * Muestra un loader/spinner
   * @param {boolean} show - true para mostrar, false para ocultar
   */
  showLoader(show = true) {
    let loader = document.getElementById('companyLoader');
    
    if (show) {
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'companyLoader';
        loader.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: ${CompanyConfig.ui.breakpoints.wide + 100};
        `;
        loader.innerHTML = `
          <div style="
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          "></div>
        `;
        document.body.appendChild(loader);
      }
      loader.style.display = 'flex';
    } else {
      if (loader) {
        loader.style.display = 'none';
      }
    }
  },

  /**
   * Confirma una acción con el usuario (Modal personalizado)
   * @param {string} message - Mensaje de confirmación
   * @param {object} options - Opciones adicionales
   * @returns {Promise<boolean>} true si confirma, false si cancela
   */
  confirm(message, options = {}) {
    return new Promise((resolve) => {
      const {
        title = '¿Estás seguro?',
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        type = 'warning', // warning, danger, info
        icon = null,
      } = options;

      // Crear modal de confirmación
      const modalId = 'confirmModal_' + Date.now();
      const modal = document.createElement('div');
      modal.id = modalId;
      modal.className = 'company-modal company-modal--open';
      modal.style.zIndex = '10000';

      // Obtener icono según el tipo
      const iconSvg = icon || this.getConfirmIcon(type);
      const iconColor = this.getConfirmColor(type);

      modal.innerHTML = `
        <div class="company-modal__backdrop" onclick="CompanyUI.resolveConfirm('${modalId}', false)"></div>
        <div class="company-modal__content" style="max-width: 450px; margin: 37px auto 20px auto; animation: scaleIn 0.3s ease;">
          <div class="company-modal__body" style="padding: 32px; text-align: center;">
            <div style="
              width: 80px;
              height: 80px;
              margin: 0 auto 24px;
              background: ${iconColor}15;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: pulse 2s ease-in-out infinite;
            ">
              <div style="color: ${iconColor}; width: 48px; height: 48px;">
                ${iconSvg}
              </div>
            </div>

            <h3 style="
              font-size: 1.5rem;
              font-weight: 600;
              color: #1b1b1f;
              margin-bottom: 12px;
            ">${title}</h3>

            <p style="
              font-size: 1rem;
              color: #666;
              line-height: 1.6;
              margin-bottom: 32px;
            ">${message}</p>

            <div style="display: flex; gap: 12px; justify-content: center;">
              <button 
                class="company-button company-button--outline company-button--lg"
                onclick="CompanyUI.resolveConfirm('${modalId}', false)"
                style="min-width: 120px;">
                ${cancelText}
              </button>
              <button 
                class="company-button company-button--${type === 'danger' ? 'error' : 'primary'} company-button--lg"
                onclick="CompanyUI.resolveConfirm('${modalId}', true)"
                style="min-width: 120px;">
                ${confirmText}
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';

      // Guardar resolver para uso posterior
      modal._resolve = resolve;
    });
  },

  /**
   * Resuelve el modal de confirmación
   */
  resolveConfirm(modalId, result) {
    const modal = document.getElementById(modalId);
    if (modal && modal._resolve) {
      modal._resolve(result);
      modal.classList.remove('company-modal--open');
      document.body.style.overflow = '';
      setTimeout(() => modal.remove(), 300);
    }
  },

  /**
   * Obtiene el icono según el tipo de confirmación
   */
  getConfirmIcon(type) {
    const icons = {
      warning: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
      `,
      danger: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      `,
      info: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      `,
    };
    return icons[type] || icons.warning;
  },

  /**
   * Obtiene el color según el tipo de confirmación
   */
  getConfirmColor(type) {
    const colors = {
      warning: '#ff9800',
      danger: '#f44336',
      info: '#2196f3',
    };
    return colors[type] || colors.warning;
  },
};

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
  }

  @keyframes slideInFromRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CompanyUI.init());
} else {
  CompanyUI.init();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompanyUI;
}
