/**
 * AdminReports.js
 * Generación y gestión de reportes del sistema
 */

const AdminReports = {
  /**
   * Estado actual de reportes
   */
  state: {
    reports: [],
    generating: false,
  },

  /**
   * Inicializa el módulo de reportes
   */
  init() {
    this.loadReports();
    this.attachEventListeners();
    console.log('AdminReports inicializado');
  },

  /**
   * Carga reportes generados desde la API
   */
  async loadReports() {
    try {
      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      const response = await AdminAPI.reports.list();
      this.state.reports = response.results || response;
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      this.state.reports = this.generateMockReports();
      this.renderReportsList();
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      AdminUI.showToast(AdminConfig.messages.errors.network, 'error');
    }
  },

  /**
   * Genera reportes mock
   */
  generateMockReports() {
    return [
      {
        id: 1,
        name: 'Reporte de Actividad Semanal',
        type: 'activity',
        format: 'PDF',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        size: '2.3 MB',
      },
      {
        id: 2,
        name: 'Ofertas Publicadas - Octubre',
        type: 'offers',
        format: 'Excel',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        size: '1.8 MB',
      },
      {
        id: 3,
        name: 'Usuarios Registrados - Septiembre',
        type: 'users',
        format: 'PDF',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        size: '3.1 MB',
      },
      {
        id: 4,
        name: 'Postulaciones del Mes',
        type: 'applications',
        format: 'Excel',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        size: '4.5 MB',
      },
    ];
  },

  /**
   * Adjunta event listeners
   */
  attachEventListeners() {
    const form = document.getElementById('generateReportForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.generateReport(new FormData(e.target));
      });
    }
  },

  /**
   * Genera un nuevo reporte
   */
  async generateReport(formData) {
    const reportType = formData.get('reportType');
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    const format = formData.get('format');

    if (!reportType || !startDate || !endDate) {
      AdminUI.showToast('Por favor completa todos los campos', 'warning');
      return;
    }

    try {
      this.state.generating = true;
      AdminUI.showLoader(true);
      AdminUI.showToast('Generando reporte...', 'info', 2000);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      const reportData = {
        type: reportType,
        start_date: startDate,
        end_date: endDate,
        format: format || 'pdf',
      };
      
      const response = await AdminAPI.reports.generate(reportData);
      await this.loadReports(); // Recargar lista
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      // Simular generación
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Agregar reporte mock
      const newReport = {
        id: this.state.reports.length + 1,
        name: this.getReportName(reportType, startDate, endDate),
        type: reportType,
        format: format || 'PDF',
        createdAt: new Date(),
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      };

      this.state.reports.unshift(newReport);
      this.renderReportsList();

      // Limpiar formulario
      document.getElementById('generateReportForm').reset();

      AdminUI.showToast('Reporte generado exitosamente', 'success');
      AdminUI.showLoader(false);
      this.state.generating = false;
    } catch (error) {
      console.error('Error al generar reporte:', error);
      AdminUI.showToast(AdminConfig.messages.errors.server, 'error');
      AdminUI.showLoader(false);
      this.state.generating = false;
    }
  },

  /**
   * Obtiene el nombre del reporte según el tipo
   */
  getReportName(type, startDate, endDate) {
    const types = {
      'activity': 'Reporte de Actividad',
      'offers': 'Reporte de Ofertas',
      'applications': 'Reporte de Postulaciones',
      'users': 'Reporte de Usuarios',
      'companies': 'Reporte de Empresas',
    };

    const start = new Date(startDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
    const end = new Date(endDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });

    return `${types[type] || 'Reporte'} (${start} - ${end})`;
  },

  /**
   * Renderiza la lista de reportes
   */
  renderReportsList() {
    const container = document.getElementById('reportsList');
    if (!container) return;

    if (this.state.reports.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
          No hay reportes generados
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <ul class="admin-list">
        ${this.state.reports.map(report => `
          <li class="admin-list__item" style="display: flex; align-items: center; justify-content: space-between;">
            <div style="flex: 1;">
              <div class="admin-list__item-primary">
                ${report.name}
                <span class="admin-badge admin-badge--info ml-2">${report.format}</span>
              </div>
              <div class="admin-list__item-secondary">
                ${AdminConfig.formatters.formatRelativeTime(report.createdAt)} • ${report.size}
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button 
                class="admin-button admin-button--sm admin-button--ghost"
                onclick="AdminReports.previewReport(${report.id})"
                title="Ver previsualización">
                Ver
              </button>
              <button 
                class="admin-button admin-button--sm admin-button--ghost"
                onclick="AdminReports.downloadReport(${report.id})"
                title="Descargar reporte">
                Descargar
              </button>
              <button 
                class="admin-button admin-button--sm admin-button--ghost"
                onclick="AdminReports.deleteReport(${report.id})"
                title="Eliminar reporte"
                style="color: var(--color-error);">
                Eliminar
              </button>
            </div>
          </li>
        `).join('')}
      </ul>
    `;
  },

  /**
   * Descarga un reporte
   */
  async downloadReport(reportId) {
    const report = this.state.reports.find(r => r.id === reportId);
    if (!report) return;

    try {
      AdminUI.showToast('Descargando reporte...', 'info', 2000);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      await AdminAPI.reports.download(reportId);
      AdminUI.showToast('Reporte descargado exitosamente', 'success');
      return;
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      // Simular descarga
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Crear archivo mock
      const content = this.generateReportContent(report);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name.replace(/\s+/g, '_')}.${report.format.toLowerCase()}`;
      a.click();
      window.URL.revokeObjectURL(url);

      AdminUI.showToast('Reporte descargado exitosamente', 'success');
    } catch (error) {
      console.error('Error al descargar reporte:', error);
      AdminUI.showToast('Error al descargar el reporte', 'error');
    }
  },

  /**
   * Previsualiza un reporte en un modal
   */
  async previewReport(reportId) {
    const report = this.state.reports.find(r => r.id === reportId);
    if (!report) return;

    try {
      AdminUI.showLoader(true);

      // INTEGRACIÓN CON DJANGO:
      // Descomentar cuando el backend esté listo
      /*
      const response = await AdminAPI.reports.get(reportId);
      const content = response.preview || response.content;
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      // Simular carga
      await new Promise(resolve => setTimeout(resolve, 500));
      const content = this.generateReportContent(report);

      AdminUI.showLoader(false);

      // Mostrar modal con previsualización
      AdminUI.showModal('reportPreviewModal', {
        title: `Previsualización: ${report.name}`,
        content: `
          <div style="margin-bottom: 16px;">
            <div style="display: flex; gap: 16px; margin-bottom: 16px;">
              <div>
                <strong>Formato:</strong> 
                <span class="admin-badge admin-badge--info">${report.format}</span>
              </div>
              <div>
                <strong>Tamaño:</strong> ${report.size}
              </div>
              <div>
                <strong>Generado:</strong> ${AdminConfig.formatters.formatRelativeTime(report.createdAt)}
              </div>
            </div>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; max-height: 400px; overflow-y: auto; font-family: monospace; font-size: 0.875rem; line-height: 1.6; white-space: pre-wrap;">
${content}
          </div>

          <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
            <button 
              class="admin-button admin-button--outline" 
              onclick="AdminUI.closeCurrentModal()">
              Cerrar
            </button>
            <button 
              class="admin-button admin-button--primary" 
              onclick="AdminReports.downloadReport(${report.id}); AdminUI.closeCurrentModal();">
              Descargar Reporte
            </button>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error al previsualizar reporte:', error);
      AdminUI.showToast('Error al cargar la previsualización', 'error');
      AdminUI.showLoader(false);
    }
  },

  /**
   * Genera contenido mock para el reporte
   */
  generateReportContent(report) {
    return `
REPORTE: ${report.name}
Formato: ${report.format}
Fecha de generación: ${AdminConfig.formatters.formatDate(report.createdAt)}

========================================
RESUMEN EJECUTIVO
========================================

Este es un reporte generado por el sistema de gestión de prácticas profesionales
de la Institución Universitaria Pascual Bravo.

Tipo de reporte: ${report.type}
Período: [Fecha inicio] - [Fecha fin]

========================================
DATOS PRINCIPALES
========================================

[Aquí irían los datos reales del reporte]

Total de registros: 150
Activos: 120
Inactivos: 30

========================================
CONCLUSIONES
========================================

[Conclusiones del análisis de datos]

========================================
Generado automáticamente por el Sistema de Gestión
Institución Universitaria Pascual Bravo
    `.trim();
  },

  /**
   * Elimina un reporte
   */
  async deleteReport(reportId) {
    const report = this.state.reports.find(r => r.id === reportId);
    if (!report) return;

    const confirmed = await AdminUI.confirm(
      `El reporte "${report.name}" será eliminado permanentemente del sistema.`,
      {
        title: 'Eliminar Reporte',
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
      await AdminAPI.reports.delete(reportId);
      await this.loadReports(); // Recargar lista
      */

      // DATOS MOCK (Remover cuando Django esté listo)
      this.state.reports = this.state.reports.filter(r => r.id !== reportId);
      this.renderReportsList();

      AdminUI.showToast(AdminConfig.messages.success.deleted, 'success');
      AdminUI.showLoader(false);
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      AdminUI.showToast(AdminConfig.messages.errors.server, 'error');
      AdminUI.showLoader(false);
    }
  },

  /**
   * Genera reporte rápido predefinido
   */
  async generateQuickReport(type) {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const formData = new FormData();
    formData.append('reportType', type);
    formData.append('startDate', lastMonth.toISOString().split('T')[0]);
    formData.append('endDate', endOfLastMonth.toISOString().split('T')[0]);
    formData.append('format', 'PDF');

    await this.generateReport(formData);
  },
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminReports;
}
