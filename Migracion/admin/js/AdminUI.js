/**
 * AdminUI.js
 * Manejo de interacciones de UI: Sidebar, Modales, Animaciones
 */

const AdminUI = {
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
    console.log('AdminUI inicializado');
  },

  /**
   * Inicializa funcionalidad del sidebar
   */
  initSidebar() {
    const menuToggle = document.getElementById('adminMenuToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.admin-overlay');
    const menuItems = document.querySelectorAll('.admin-sidebar__menu-item');

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
    if (window.innerWidth <= AdminConfig.ui.breakpoints.tablet) {
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
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.admin-overlay');

    this.sidebarOpen = !this.sidebarOpen;

    if (this.sidebarOpen) {
      sidebar?.classList.add('admin-sidebar--open');
      overlay?.classList.add('admin-overlay--visible');
      document.body.style.overflow = 'hidden';
    } else {
      sidebar?.classList.remove('admin-sidebar--open');
      overlay?.classList.remove('admin-overlay--visible');
      document.body.style.overflow = '';
    }
  },

  /**
   * Cierra el sidebar
   */
  closeSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.admin-overlay');

    this.sidebarOpen = false;
    sidebar?.classList.remove('admin-sidebar--open');
    overlay?.classList.remove('admin-overlay--visible');
    document.body.style.overflow = '';
  },

  /**
   * Maneja el click en un item del menú
   * @param {HTMLElement} item - Elemento del menú clickeado
   * @param {string} route - Ruta a navegar
   */
  handleMenuItemClick(item, route) {
    // Remover clase active de todos los items
    document.querySelectorAll('.admin-sidebar__menu-item').forEach(menuItem => {
      menuItem.classList.remove('admin-sidebar__menu-item--active');
    });

    // Agregar clase active al item clickeado
    item.classList.add('admin-sidebar__menu-item--active');

    // Navegar a la ruta (manejado por AdminRouter)
    if (typeof AdminRouter !== 'undefined') {
      AdminRouter.navigate(route);
    }
  },

  /**
   * Inicializa funcionalidad de modales
   */
  initModals() {
    // Cerrar modales al hacer click en backdrop
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('admin-modal__backdrop')) {
        const modal = e.target.closest('.admin-modal');
        this.closeModal(modal);
      }
    });

    // Cerrar modales con botón de cerrar
    document.querySelectorAll('.admin-modal__close').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        const modal = e.target.closest('.admin-modal');
        this.closeModal(modal);
      });
    });

    // Cerrar modales con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.admin-modal--open');
        if (openModal) {
          this.closeModal(openModal);
        }
      }
    });
  },

  /**
   * Modal actual abierto
   */
  currentModal: null,

  /**
   * Abre un modal (versión mejorada con contenido dinámico)
   * @param {string} modalId - ID del modal a abrir
   * @param {object} options - Opciones del modal (title, content, onOpen)
   */
  openModal(modalId, options = {}) {
    // Cerrar modal anterior si existe
    if (this.currentModal) {
      this.closeCurrentModal();
    }

    // Crear modal dinámico
    let modal = document.getElementById(modalId);
    if (!modal) {
      modal = this.createModal(modalId, options);
    } else if (options.content) {
      // Actualizar contenido si el modal ya existe
      const modalBody = modal.querySelector('.admin-modal__body');
      if (modalBody) {
        modalBody.innerHTML = options.content;
      }
    }

    // Mostrar modal
    modal.classList.add('admin-modal--open');
    document.body.style.overflow = 'hidden';
    this.currentModal = modal;

    // Callback onOpen
    if (options.onOpen && typeof options.onOpen === 'function') {
      setTimeout(() => options.onOpen(), 100);
    }
  },

  /**
   * Crea un modal dinámico
   * @param {string} modalId - ID del modal
   * @param {object} options - Opciones (title, content)
   * @returns {HTMLElement} Elemento del modal
   */
  createModal(modalId, options = {}) {
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="admin-modal__backdrop"></div>
      <div class="admin-modal__container">
        <div class="admin-modal__header">
          <h3 class="admin-modal__title">${options.title || 'Modal'}</h3>
          <button class="admin-modal__close" onclick="AdminUI.closeCurrentModal()" aria-label="Cerrar modal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="admin-modal__body">
          ${options.content || ''}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  },

  /**
   * Cierra el modal actual
   */
  closeCurrentModal() {
    if (this.currentModal) {
      this.currentModal.classList.remove('admin-modal--open');
      document.body.style.overflow = '';
      this.currentModal = null;
    }
  },

  /**
   * Cierra un modal específico
   * @param {HTMLElement|string} modal - Elemento del modal o ID
   */
  closeModal(modal) {
    const modalElement = typeof modal === 'string' 
      ? document.getElementById(modal) 
      : modal;
    
    if (modalElement) {
      modalElement.classList.remove('admin-modal--open');
      document.body.style.overflow = '';
      if (this.currentModal === modalElement) {
        this.currentModal = null;
      }
    }
  },

  /**
   * Muestra un modal personalizado
   * @param {object} options - Opciones del modal
   */
  showModal(modalId, options = {}) {
    this.openModal(modalId, options);
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
    if (width > AdminConfig.ui.breakpoints.tablet) {
      this.closeSidebar();
    }

    // Ajustar búsqueda en appbar
    const searchInput = document.querySelector('.admin-appbar__search');
    if (searchInput) {
      if (width <= AdminConfig.ui.breakpoints.mobile) {
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
    const cards = document.querySelectorAll('.admin-card');
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
   * Muestra una notificación toast mejorada
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duración en ms (default: 3000)
   */
  showToast(message, type = 'info', duration = 3000) {
    // Crear contenedor de toasts si no existe
    let toastContainer = document.getElementById('adminToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'adminToastContainer';
      toastContainer.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 400px;
      `;
      document.body.appendChild(toastContainer);
    }

    // Obtener icono y color
    const toastIcon = this.getToastIcon(type);
    const toastColor = this.getToastColor(type);

    // Crear toast
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast--${type}`;
    toast.style.cssText = `
      background: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      min-width: 320px;
      max-width: 400px;
      animation: slideInFromRight 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      border-left: 4px solid ${toastColor};
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      overflow: hidden;
    `;

    toast.innerHTML = `
      <div style="
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        color: ${toastColor};
      ">
        ${toastIcon}
      </div>
      <div style="
        flex: 1;
        font-size: 0.9375rem;
        color: var(--color-text-primary);
        line-height: 1.5;
      ">
        ${message}
      </div>
      <button 
        onclick="this.parentElement.remove()"
        style="
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--color-text-secondary);
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        "
        onmouseover="this.style.background='rgba(0,0,0,0.05)'"
        onmouseout="this.style.background='transparent'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
      <div style="
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: ${toastColor};
        animation: toastProgress ${duration}ms linear;
      "></div>
    `;

    toastContainer.appendChild(toast);

    // Auto-remover después de la duración
    setTimeout(() => {
      toast.style.animation = 'slideOutToRight 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  },

  /**
   * Obtiene el icono según el tipo de toast
   */
  getToastIcon(type) {
    const icons = {
      success: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      `,
      error: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      `,
      warning: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
      `,
      info: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      `,
    };
    return icons[type] || icons.info;
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
    let loader = document.getElementById('adminLoader');
    
    if (show) {
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'adminLoader';
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
          z-index: ${AdminConfig.ui.breakpoints.wide + 100};
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
      modal.className = 'admin-modal admin-modal--open';
      modal.style.zIndex = '10000';

      // Obtener icono según el tipo
      const iconSvg = icon || this.getConfirmIcon(type);
      const iconColor = this.getConfirmColor(type);

      modal.innerHTML = `
        <div class="admin-modal__backdrop" onclick="AdminUI.resolveConfirm('${modalId}', false)"></div>
        <div class="admin-modal__container" style="max-width: 450px; animation: scaleIn 0.3s ease;">
          <div class="admin-modal__body" style="padding: 32px; text-align: center;">
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
              color: var(--color-text-primary);
              margin-bottom: 12px;
            ">${title}</h3>

            <p style="
              font-size: 1rem;
              color: var(--color-text-secondary);
              line-height: 1.6;
              margin-bottom: 32px;
            ">${message}</p>

            <div style="display: flex; gap: 12px; justify-content: center;">
              <button 
                class="admin-button admin-button--outline admin-button--lg"
                onclick="AdminUI.resolveConfirm('${modalId}', false)"
                style="min-width: 120px;">
                ${cancelText}
              </button>
              <button 
                class="admin-button admin-button--${type === 'danger' ? 'error' : 'primary'} admin-button--lg"
                onclick="AdminUI.resolveConfirm('${modalId}', true)"
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
      modal.classList.remove('admin-modal--open');
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
    }
    50% {
      transform: scale(1.05);
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

  @keyframes slideOutToRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes toastProgress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }

  /* Estilos para botones de error */
  .admin-button--error {
    background-color: #f44336;
    color: white;
    border: none;
  }

  .admin-button--error:hover {
    background-color: #d32f2f;
  }

  /* Estilos para botones de warning */
  .admin-button--warning {
    background-color: #ff9800;
    color: white;
    border: none;
  }

  .admin-button--warning:hover {
    background-color: #f57c00;
  }

  .admin-button--lg {
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 500;
  }
`;
document.head.appendChild(style);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AdminUI.init());
} else {
  AdminUI.init();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminUI;
}
