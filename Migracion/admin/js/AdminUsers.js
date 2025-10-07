/**
 * AdminUsers.js
 * Gestión completa de usuarios: CRUD, búsqueda, filtros, paginación
 */

const AdminUsers = {
  /**
   * Estado actual de usuarios
   */
  state: {
    users: [],
    filteredUsers: [],
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
    filters: {
      search: '',
      type: 'all',
      status: 'all',
    },
    sortBy: 'id',
    sortOrder: 'asc',
  },

  /**
   * Inicializa el módulo de usuarios
   */
  init() {
    this.loadUsers();
    this.attachEventListeners();
    console.log('AdminUsers inicializado');
  },

  /**
   * Carga usuarios desde la API
   * Usa datos mock si AdminAPI no está disponible
   */
  async loadUsers() {
    try {
      AdminUI.showLoader(true);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      const params = {
        page: this.state.currentPage,
        page_size: this.state.itemsPerPage,
        search: this.state.filters.search,
        user_type: this.state.filters.type !== 'all' ? this.state.filters.type : undefined,
        is_active: this.state.filters.status !== 'all' ? (this.state.filters.status === 'Activo') : undefined,
      };
      
      const response = await AdminAPI.users.list(params);
      this.state.users = response.results;
      this.state.totalPages = Math.ceil(response.count / this.state.itemsPerPage);
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      this.state.users = this.generateMockUsers(50);
      this.state.filteredUsers = [...this.state.users];
      this.calculatePagination();
      this.render();

      AdminUI.showLoader(false);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      AdminUI.showToast(AdminConfig.messages.errors.network, 'error');
      AdminUI.showLoader(false);
    }
  },

  /**
   * Genera usuarios mock para desarrollo
   */
  generateMockUsers(count) {
    const types = ['Estudiante', 'Empresa', 'Administrador'];
    const statuses = ['Activo', 'Inactivo'];
    const names = [
      'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez',
      'Pedro Rodríguez', 'Laura Fernández', 'Diego Sánchez', 'Sofia Torres',
      'Empresa Tech Solutions', 'Empresa Data Corp', 'Empresa XYZ',
      'Empresa Innovate SA', 'Empresa Digital Plus'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)] + ` ${i + 1}`,
      email: `usuario${i + 1}@example.com`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    }));
  },

  /**
   * Adjunta event listeners
   */
  attachEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('userSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.filters.search = e.target.value;
        this.applyFilters();
      });
    }

    // Filtro de tipo
    const typeSelect = document.getElementById('userTypeFilter');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        this.state.filters.type = e.target.value;
        this.applyFilters();
      });
    }

    // Filtro de estado
    const statusSelect = document.getElementById('userStatusFilter');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.state.filters.status = e.target.value;
        this.applyFilters();
      });
    }
  },

  /**
   * Aplica filtros a la lista de usuarios
   */
  applyFilters() {
    let filtered = [...this.state.users];

    // Filtro de búsqueda
    if (this.state.filters.search) {
      const search = this.state.filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    // Filtro de tipo
    if (this.state.filters.type !== 'all') {
      filtered = filtered.filter(user => user.type === this.state.filters.type);
    }

    // Filtro de estado
    if (this.state.filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === this.state.filters.status);
    }

    this.state.filteredUsers = filtered;
    this.state.currentPage = 1;
    this.calculatePagination();
    this.render();
  },

  /**
   * Ordena usuarios por columna
   */
  sortBy(column) {
    if (this.state.sortBy === column) {
      this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortBy = column;
      this.state.sortOrder = 'asc';
    }

    this.state.filteredUsers.sort((a, b) => {
      let aVal = a[column];
      let bVal = b[column];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (this.state.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    this.render();
  },

  /**
   * Calcula paginación
   */
  calculatePagination() {
    this.state.totalPages = Math.ceil(
      this.state.filteredUsers.length / this.state.itemsPerPage
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
   * Renderiza la vista de usuarios
   */
  render() {
    const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
    const end = start + this.state.itemsPerPage;
    const pageUsers = this.state.filteredUsers.slice(start, end);

    // Renderizar tabla
    this.renderTable(pageUsers);
    
    // Renderizar paginación
    this.renderPagination();
    
    // Renderizar estadísticas
    this.renderStats();
  },

  /**
   * Renderiza la tabla de usuarios
   */
  renderTable(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    if (users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="admin-table__cell" style="text-align: center; padding: 40px;">
            No se encontraron usuarios
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = users.map(user => `
      <tr class="admin-table__row">
        <td class="admin-table__cell">${user.id}</td>
        <td class="admin-table__cell">
          <div style="font-weight: 500;">${user.name}</div>
        </td>
        <td class="admin-table__cell">${user.email}</td>
        <td class="admin-table__cell">
          <span class="admin-badge admin-badge--${this.getUserTypeBadgeClass(user.type)}">
            ${user.type}
          </span>
        </td>
        <td class="admin-table__cell">
          <span class="admin-badge admin-badge--${user.status === 'Activo' ? 'success' : 'error'}">
            ${user.status}
          </span>
        </td>
        <td class="admin-table__cell">
          ${AdminConfig.formatters.formatRelativeTime(user.lastLogin)}
        </td>
        <td class="admin-table__cell">
          <button 
            class="admin-button admin-button--sm admin-button--ghost"
            onclick="AdminUsers.viewUser(${user.id})"
            title="Ver detalles">
            Ver
          </button>
          <button 
            class="admin-button admin-button--sm admin-button--ghost"
            onclick="AdminUsers.editUser(${user.id})"
            title="Editar usuario">
            Editar
          </button>
          <button 
            class="admin-button admin-button--sm admin-button--ghost"
            onclick="AdminUsers.deleteUser(${user.id})"
            title="Eliminar usuario"
            style="color: var(--color-error);">
            Eliminar
          </button>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Renderiza la paginación
   */
  renderPagination() {
    const container = document.getElementById('usersPagination');
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
          onclick="AdminUsers.goToPage(${currentPage - 1})"
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
              onclick="AdminUsers.goToPage(${page})">
              ${page}
            </button>
          `;
        }).join('')}
        
        <button 
          class="admin-button admin-button--sm admin-button--outline"
          onclick="AdminUsers.goToPage(${currentPage + 1})"
          ${currentPage === totalPages ? 'disabled' : ''}>
          Siguiente
        </button>
      </div>
    `;
  },

  /**
   * Renderiza estadísticas de usuarios
   */
  renderStats() {
    const container = document.getElementById('usersStats');
    if (!container) return;

    const total = this.state.filteredUsers.length;
    const active = this.state.filteredUsers.filter(u => u.status === 'Activo').length;
    const students = this.state.filteredUsers.filter(u => u.type === 'Estudiante').length;
    const companies = this.state.filteredUsers.filter(u => u.type === 'Empresa').length;

    container.innerHTML = `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 150px;">
          <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Total</div>
          <div style="font-size: 1.5rem; font-weight: 600; color: var(--color-primary);">${total}</div>
        </div>
        <div style="flex: 1; min-width: 150px;">
          <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Activos</div>
          <div style="font-size: 1.5rem; font-weight: 600; color: var(--color-success);">${active}</div>
        </div>
        <div style="flex: 1; min-width: 150px;">
          <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Estudiantes</div>
          <div style="font-size: 1.5rem; font-weight: 600; color: var(--color-info);">${students}</div>
        </div>
        <div style="flex: 1; min-width: 150px;">
          <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Empresas</div>
          <div style="font-size: 1.5rem; font-weight: 600; color: var(--color-secondary);">${companies}</div>
        </div>
      </div>
    `;
  },

  /**
   * Obtiene la clase de badge según el tipo de usuario
   */
  getUserTypeBadgeClass(type) {
    const classes = {
      'Estudiante': 'info',
      'Empresa': 'primary',
      'Administrador': 'secondary',
    };
    return classes[type] || 'info';
  },

  /**
   * Ver detalles de un usuario
   */
  async viewUser(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;

    // Generar sección de documentos según el tipo de usuario
    const documentsSection = this.generateDocumentsSection(user);

    AdminUI.showModal('userDetailModal', {
      title: 'Detalles del Usuario',
      content: `
        <div style="display: grid; gap: 16px;">
          <div>
            <strong>ID:</strong> ${user.id}
          </div>
          <div>
            <strong>Nombre:</strong> ${user.name}
          </div>
          <div>
            <strong>Email:</strong> ${user.email}
          </div>
          <div>
            <strong>Tipo:</strong> 
            <span class="admin-badge admin-badge--${this.getUserTypeBadgeClass(user.type)}">
              ${user.type}
            </span>
          </div>
          <div>
            <strong>Estado:</strong> 
            <span class="admin-badge admin-badge--${user.status === 'Activo' ? 'success' : 'error'}">
              ${user.status}
            </span>
          </div>
          <div>
            <strong>Fecha de registro:</strong> ${AdminConfig.formatters.formatDate(user.createdAt)}
          </div>
          <div>
            <strong>Último acceso:</strong> ${AdminConfig.formatters.formatRelativeTime(user.lastLogin)}
          </div>

          ${documentsSection}
        </div>
      `,
    });
  },

  /**
   * Genera la sección de documentos según el tipo de usuario
   */
  generateDocumentsSection(user) {
    // INTEGRACIÓN CON DJANGO:
    // Los documentos vendrán del backend según el tipo de usuario
    // Estructura esperada: user.documents = [{ id, name, type, size, url }]

    let documents = [];
    let title = '';

    // Generar documentos mock según el tipo de usuario
    if (user.type === 'Estudiante') {
      title = 'Hoja de Vida';
      documents = [
        { id: 1, name: 'CV_' + user.name.replace(/\s+/g, '_') + '.pdf', type: 'CV', size: '245 KB' },
        { id: 2, name: 'Certificado_Estudios.pdf', type: 'Certificado', size: '180 KB' },
      ];
    } else if (user.type === 'Empresa') {
      title = 'Documentos Legales';
      documents = [
        { id: 1, name: 'RUT_' + user.name.replace(/\s+/g, '_') + '.pdf', type: 'RUT', size: '320 KB' },
        { id: 2, name: 'Camara_Comercio.pdf', type: 'Cámara de Comercio', size: '450 KB' },
        { id: 3, name: 'Certificacion_Bancaria.pdf', type: 'Certificación', size: '210 KB' },
      ];
    } else if (user.type === 'Administrador') {
      title = 'Documentos';
      documents = [
        { id: 1, name: 'Cedula_' + user.name.replace(/\s+/g, '_') + '.pdf', type: 'Identificación', size: '190 KB' },
        { id: 2, name: 'Contrato_Laboral.pdf', type: 'Contrato', size: '380 KB' },
      ];
    }

    if (documents.length === 0) {
      return '';
    }

    return `
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--color-divider);">
        <h4 style="margin-bottom: 16px; font-size: 1rem; font-weight: 600;">${title}</h4>
        <div style="display: grid; gap: 12px;">
          ${documents.map(doc => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f5f5f5; border-radius: 8px;">
              <div style="flex: 1;">
                <div style="font-weight: 500; margin-bottom: 4px;">${doc.name}</div>
                <div style="font-size: 0.875rem; color: var(--color-text-secondary);">
                  ${doc.type} • ${doc.size}
                </div>
              </div>
              <button 
                class="admin-button admin-button--sm admin-button--primary"
                onclick="AdminUsers.previewDocument(${user.id}, ${doc.id})"
                style="white-space: nowrap;">
                Ver Documento
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Previsualiza un documento del usuario
   */
  async previewDocument(userId, documentId) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;

    try {
      AdminUI.showLoader(true);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      const response = await AdminAPI.users.getDocument(userId, documentId);
      const document = response;
      const content = response.preview || response.content;
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generar documento mock
      let documents = [];
      if (user.type === 'Estudiante') {
        documents = [
          { id: 1, name: 'CV_' + user.name.replace(/\s+/g, '_') + '.pdf', type: 'CV', size: '245 KB' },
          { id: 2, name: 'Certificado_Estudios.pdf', type: 'Certificado', size: '180 KB' },
        ];
      } else if (user.type === 'Empresa') {
        documents = [
          { id: 1, name: 'RUT_' + user.name.replace(/\s+/g, '_') + '.pdf', type: 'RUT', size: '320 KB' },
          { id: 2, name: 'Camara_Comercio.pdf', type: 'Cámara de Comercio', size: '450 KB' },
          { id: 3, name: 'Certificacion_Bancaria.pdf', type: 'Certificación', size: '210 KB' },
        ];
      } else {
        documents = [
          { id: 1, name: 'Cedula_' + user.name.replace(/\s+/g, '_') + '.pdf', type: 'Identificación', size: '190 KB' },
          { id: 2, name: 'Contrato_Laboral.pdf', type: 'Contrato', size: '380 KB' },
        ];
      }

      const document = documents.find(d => d.id === documentId);
      if (!document) {
        AdminUI.showToast('Documento no encontrado', 'error');
        AdminUI.showLoader(false);
        return;
      }

      const content = this.generateDocumentPreview(user, document);

      AdminUI.showLoader(false);

      // Cerrar modal anterior y mostrar previsualización
      AdminUI.closeCurrentModal();
      
      setTimeout(() => {
        AdminUI.showModal('documentPreviewModal', {
          title: `Previsualización: ${document.name}`,
          content: `
            <div style="margin-bottom: 16px;">
              <div style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
                <div>
                  <strong>Usuario:</strong> ${user.name}
                </div>
                <div>
                  <strong>Tipo:</strong> 
                  <span class="admin-badge admin-badge--info">${document.type}</span>
                </div>
                <div>
                  <strong>Tamaño:</strong> ${document.size}
                </div>
              </div>
            </div>

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; max-height: 400px; overflow-y: auto; font-family: monospace; font-size: 0.875rem; line-height: 1.6; white-space: pre-wrap;">
${content}
            </div>

            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
              <button 
                class="admin-button admin-button--outline" 
                onclick="AdminUI.closeCurrentModal(); AdminUsers.viewUser(${userId});">
                Volver
              </button>
              <button 
                class="admin-button admin-button--primary" 
                onclick="AdminUsers.downloadDocument(${userId}, ${documentId});">
                Descargar Documento
              </button>
            </div>
          `,
        });
      }, 100);
    } catch (error) {
      console.error('Error al previsualizar documento:', error);
      AdminUI.showToast('Error al cargar el documento', 'error');
      AdminUI.showLoader(false);
    }
  },

  /**
   * Genera contenido de previsualización del documento
   */
  generateDocumentPreview(user, document) {
    if (document.type === 'CV') {
      return `
═══════════════════════════════════════════════════
                    HOJA DE VIDA
═══════════════════════════════════════════════════

INFORMACIÓN PERSONAL
────────────────────────────────────────────────────
Nombre:          ${user.name}
Email:           ${user.email}
Teléfono:        +57 300 123 4567
Dirección:       Calle 123 #45-67, Medellín

PERFIL PROFESIONAL
────────────────────────────────────────────────────
Estudiante de último semestre con sólidos conocimientos
en desarrollo de software y gestión de proyectos.
Experiencia en trabajo en equipo y liderazgo.

EDUCACIÓN
────────────────────────────────────────────────────
Institución Universitaria Pascual Bravo
Ingeniería de Sistemas
2020 - 2025 (En curso)

EXPERIENCIA
────────────────────────────────────────────────────
Practicante de Desarrollo
Empresa XYZ | 2024
- Desarrollo de aplicaciones web
- Trabajo con metodologías ágiles
- Colaboración en equipo

HABILIDADES TÉCNICAS
────────────────────────────────────────────────────
• JavaScript, Python, Java
• React, Django, Node.js
• Git, Docker, AWS
• SQL, MongoDB

IDIOMAS
────────────────────────────────────────────────────
Español:  Nativo
Inglés:   Intermedio (B1)

REFERENCIAS
────────────────────────────────────────────────────
Disponibles a solicitud
`;
    } else if (document.type === 'RUT') {
      return `
═══════════════════════════════════════════════════
          REGISTRO ÚNICO TRIBUTARIO (RUT)
═══════════════════════════════════════════════════

INFORMACIÓN DE LA EMPRESA
────────────────────────────────────────────────────
Razón Social:    ${user.name}
NIT:             900.123.456-7
Dígito Verificación: 7

UBICACIÓN
────────────────────────────────────────────────────
Dirección:       Carrera 50 #25-30
Ciudad:          Medellín
Departamento:    Antioquia
País:            Colombia

ACTIVIDAD ECONÓMICA
────────────────────────────────────────────────────
Código CIIU:     6201
Actividad:       Desarrollo de software

RESPONSABILIDADES TRIBUTARIAS
────────────────────────────────────────────────────
• IVA - Régimen común
• Retención en la fuente
• Impuesto de renta

REPRESENTANTE LEGAL
────────────────────────────────────────────────────
Nombre:          Juan Pérez
CC:              1.234.567
Email:           ${user.email}

FECHA DE EXPEDICIÓN
────────────────────────────────────────────────────
${AdminConfig.formatters.formatDate(new Date())}

═══════════════════════════════════════════════════
Este documento es una representación simplificada
del RUT oficial expedido por la DIAN.
═══════════════════════════════════════════════════
`;
    } else if (document.type === 'Cámara de Comercio') {
      return `
═══════════════════════════════════════════════════
        CERTIFICADO DE CÁMARA DE COMERCIO
═══════════════════════════════════════════════════

INFORMACIÓN DE LA EMPRESA
────────────────────────────────────────────────────
Razón Social:    ${user.name}
NIT:             900.123.456-7
Matrícula:       12345678

FECHA DE CONSTITUCIÓN
────────────────────────────────────────────────────
15 de Enero de 2020

OBJETO SOCIAL
────────────────────────────────────────────────────
Desarrollo, implementación y comercialización de
soluciones tecnológicas y software a medida.
Prestación de servicios de consultoría en TI.

CAPITAL SOCIAL
────────────────────────────────────────────────────
Capital Autorizado:  $100.000.000
Capital Suscrito:    $100.000.000
Capital Pagado:      $100.000.000

REPRESENTANTE LEGAL
────────────────────────────────────────────────────
Nombre:          Juan Pérez
CC:              1.234.567

ESTADO
────────────────────────────────────────────────────
ACTIVA

CERTIFICADO EXPEDIDO
────────────────────────────────────────────────────
${AdminConfig.formatters.formatDate(new Date())}

═══════════════════════════════════════════════════
Cámara de Comercio de Medellín para Antioquia
═══════════════════════════════════════════════════
`;
    } else {
      return `
═══════════════════════════════════════════════════
                    ${document.type.toUpperCase()}
═══════════════════════════════════════════════════

INFORMACIÓN DEL DOCUMENTO
────────────────────────────────────────────────────
Usuario:         ${user.name}
Email:           ${user.email}
Tipo:            ${document.type}
Nombre Archivo:  ${document.name}
Tamaño:          ${document.size}

CONTENIDO
────────────────────────────────────────────────────
Este es un documento de ejemplo que contiene
información relevante del usuario.

En la integración con Django, aquí se mostrará
el contenido real del documento o una previsualización
generada por el backend.

FECHA DE GENERACIÓN
────────────────────────────────────────────────────
${AdminConfig.formatters.formatDate(new Date())}

═══════════════════════════════════════════════════
`;
    }
  },

  /**
   * Descarga un documento del usuario
   */
  async downloadDocument(userId, documentId) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;

    try {
      AdminUI.showToast('Descargando documento...', 'info', 2000);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      await AdminAPI.users.downloadDocument(userId, documentId);
      AdminUI.showToast('Documento descargado exitosamente', 'success');
      return;
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generar documento mock
      let documents = [];
      if (user.type === 'Estudiante') {
        documents = [
          { id: 1, name: 'CV_' + user.name.replace(/\s+/g, '_') + '.pdf', type: 'CV', size: '245 KB' },
          { id: 2, name: 'Certificado_Estudios.pdf', type: 'Certificado', size: '180 KB' },
        ];
      } else if (user.type === 'Empresa') {
        documents = [
          { id: 1, name: 'RUT_' + user.name.replace(/\s+/g, '_') + '.pdf', type: 'RUT', size: '320 KB' },
          { id: 2, name: 'Camara_Comercio.pdf', type: 'Cámara de Comercio', size: '450 KB' },
          { id: 3, name: 'Certificacion_Bancaria.pdf', type: 'Certificación', size: '210 KB' },
        ];
      } else {
        documents = [
          { id: 1, name: 'Cedula_' + user.name.replace(/\s+/g, '_') + '.pdf', type: 'Identificación', size: '190 KB' },
          { id: 2, name: 'Contrato_Laboral.pdf', type: 'Contrato', size: '380 KB' },
        ];
      }

      const document = documents.find(d => d.id === documentId);
      if (!document) return;

      const content = this.generateDocumentPreview(user, document);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      a.click();
      window.URL.revokeObjectURL(url);

      AdminUI.showToast('Documento descargado exitosamente', 'success');
    } catch (error) {
      console.error('Error al descargar documento:', error);
      AdminUI.showToast('Error al descargar el documento', 'error');
    }
  },

  /**
   * Editar usuario
   */
  async editUser(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;

    AdminUI.showModal('userEditModal', {
      title: 'Editar Usuario',
      content: `
        <form id="editUserForm" style="display: grid; gap: 16px;">
          <div class="admin-form-group">
            <label class="admin-form-label">Nombre</label>
            <input type="text" class="admin-form-input" name="name" value="${user.name}" required>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Email</label>
            <input type="email" class="admin-form-input" name="email" value="${user.email}" required>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Tipo</label>
            <select class="admin-form-select" name="type" required>
              <option value="Estudiante" ${user.type === 'Estudiante' ? 'selected' : ''}>Estudiante</option>
              <option value="Empresa" ${user.type === 'Empresa' ? 'selected' : ''}>Empresa</option>
              <option value="Administrador" ${user.type === 'Administrador' ? 'selected' : ''}>Administrador</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Estado</label>
            <select class="admin-form-select" name="status" required>
              <option value="Activo" ${user.status === 'Activo' ? 'selected' : ''}>Activo</option>
              <option value="Inactivo" ${user.status === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
            </select>
          </div>
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button type="button" class="admin-button admin-button--outline" onclick="AdminUI.closeCurrentModal()">
              Cancelar
            </button>
            <button type="submit" class="admin-button admin-button--primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      `,
      onOpen: () => {
        document.getElementById('editUserForm').addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveUser(userId, new FormData(e.target));
        });
      },
    });
  },

  /**
   * Guarda cambios de un usuario
   */
  async saveUser(userId, formData) {
    try {
      AdminUI.showLoader(true);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      const userData = {
        username: formData.get('name').split(' ')[0].toLowerCase(),
        first_name: formData.get('name').split(' ')[0],
        last_name: formData.get('name').split(' ').slice(1).join(' '),
        email: formData.get('email'),
        user_type: formData.get('type').toLowerCase(),
        is_active: formData.get('status') === 'Activo',
      };
      
      await AdminAPI.users.update(userId, userData);
      await this.loadUsers(); // Recargar lista
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      const userIndex = this.state.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        this.state.users[userIndex] = {
          ...this.state.users[userIndex],
          name: formData.get('name'),
          email: formData.get('email'),
          type: formData.get('type'),
          status: formData.get('status'),
        };
      }

      this.applyFilters();
      AdminUI.closeCurrentModal();
      AdminUI.showToast(AdminConfig.messages.success.saved, 'success');
      AdminUI.showLoader(false);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      AdminUI.showToast(AdminConfig.messages.errors.server, 'error');
      AdminUI.showLoader(false);
    }
  },

  /**
   * Eliminar usuario
   */
  async deleteUser(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;

    const confirmed = await AdminUI.confirm(
      `Esta acción eliminará permanentemente al usuario "${user.name}" y todos sus datos asociados.`,
      {
        title: 'Eliminar Usuario',
        confirmText: 'Sí, Eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    );

    if (!confirmed) return;

    try {
      AdminUI.showLoader(true);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      await AdminAPI.users.delete(userId);
      await this.loadUsers(); // Recargar lista
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      this.state.users = this.state.users.filter(u => u.id !== userId);
      this.applyFilters();

      AdminUI.showToast(AdminConfig.messages.success.deleted, 'success');
      AdminUI.showLoader(false);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      AdminUI.showToast(AdminConfig.messages.errors.server, 'error');
      AdminUI.showLoader(false);
    }
  },

  /**
   * Crear nuevo usuario
   */
  createUser() {
    AdminUI.showModal('userCreateModal', {
      title: 'Crear Nuevo Usuario',
      content: `
        <form id="createUserForm" style="display: grid; gap: 16px;">
          <div class="admin-form-group">
            <label class="admin-form-label">Nombre</label>
            <input type="text" class="admin-form-input" name="name" required>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Email</label>
            <input type="email" class="admin-form-input" name="email" required>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Tipo</label>
            <select class="admin-form-select" name="type" required>
              <option value="Estudiante">Estudiante</option>
              <option value="Empresa">Empresa</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Contraseña</label>
            <input type="password" class="admin-form-input" name="password" required>
          </div>
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button type="button" class="admin-button admin-button--outline" onclick="AdminUI.closeCurrentModal()">
              Cancelar
            </button>
            <button type="submit" class="admin-button admin-button--primary">
              Crear Usuario
            </button>
          </div>
        </form>
      `,
      onOpen: () => {
        document.getElementById('createUserForm').addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveNewUser(new FormData(e.target));
        });
      },
    });
  },

  /**
   * Guarda nuevo usuario
   */
  async saveNewUser(formData) {
    try {
      AdminUI.showLoader(true);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      const userData = {
        username: formData.get('email').split('@')[0],
        email: formData.get('email'),
        password: formData.get('password'),
        first_name: formData.get('name').split(' ')[0],
        last_name: formData.get('name').split(' ').slice(1).join(' '),
        user_type: formData.get('type').toLowerCase(),
      };
      
      await AdminAPI.users.create(userData);
      await this.loadUsers(); // Recargar lista
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      const newUser = {
        id: this.state.users.length + 1,
        name: formData.get('name'),
        email: formData.get('email'),
        type: formData.get('type'),
        status: 'Activo',
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      this.state.users.unshift(newUser);
      this.applyFilters();

      AdminUI.closeCurrentModal();
      AdminUI.showToast(AdminConfig.messages.success.created, 'success');
      AdminUI.showLoader(false);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      AdminUI.showToast(AdminConfig.messages.errors.server, 'error');
      AdminUI.showLoader(false);
    }
  },

  /**
   * Exportar usuarios a CSV
   */
  exportToCSV() {
    const headers = ['ID', 'Nombre', 'Email', 'Tipo', 'Estado', 'Fecha Registro'];
    const rows = this.state.filteredUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.type,
      user.status,
      AdminConfig.formatters.formatDate(user.createdAt),
    ]);

    let csv = headers.join(',') + '\n';
    csv += rows.map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    AdminUI.showToast('Usuarios exportados exitosamente', 'success');
  },
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminUsers;
}
