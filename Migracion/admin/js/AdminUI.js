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
   * Abre un modal
   * @param {string} modalId - ID del modal a abrir
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('admin-modal--open');
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
      modalElement.classList.remove('admin-modal--open');
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
   * Muestra una notificación toast
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
        z-index: ${AdminConfig.ui.breakpoints.wide};
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(toastContainer);
    }

    // Crear toast
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast--${type}`;
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
   * Confirma una acción con el usuario
   * @param {string} message - Mensaje de confirmación
   * @returns {Promise<boolean>} true si confirma, false si cancela
   */
  confirm(message) {
    return new Promise((resolve) => {
      // Por ahora usamos confirm nativo
      // TODO: Implementar modal de confirmación personalizado
      const result = window.confirm(message);
      resolve(result);
    });
  },
};

// Agregar estilos de animación para el loader
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
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
