# Panel de Empresa - Documentación

## 📋 Descripción General

Panel de administración para empresas que permite gestionar ofertas de prácticas y postulantes. Desarrollado con JavaScript vanilla y arquitectura modular SPA (Single Page Application).

## 🗂️ Estructura de Archivos

```
company/
├── CompanyPanel.html          # Página principal
├── css/
│   ├── CompanyVariables.css   # Variables CSS (colores, espaciados)
│   ├── CompanyBase.css        # Estilos base y reset
│   ├── CompanyLayout.css      # Layout (sidebar, appbar, main)
│   └── CompanyComponents.css  # Componentes reutilizables
└── js/
    ├── CompanyConfig.js       # Configuración global y constantes
    ├── CompanyUI.js           # Interacciones UI (sidebar, modales, toasts)
    ├── CompanyRouter.js       # Sistema de rutas SPA
    ├── CompanyDashboard.js    # Lógica del dashboard
    ├── CompanyOffers.js       # Gestión de ofertas
    └── CompanyApplicants.js   # Gestión de postulantes
```

## 🎯 Funcionalidades Principales

### 1. Dashboard
- **Estadísticas generales**: Ofertas activas, borradores, nuevas postulaciones
- **Actividad reciente**: Últimas acciones realizadas
- **Acciones rápidas**: Botones de acceso directo

### 2. Gestión de Ofertas
- **Listar ofertas**: Tabla con todas las ofertas (activas, borradores, cerradas)
- **Crear oferta**: Formulario para publicar nuevas ofertas de prácticas
- **Editar oferta**: Modificar ofertas existentes
- **Publicar borrador**: Convertir borradores en ofertas activas
- **Cerrar oferta**: Finalizar ofertas activas
- **Estadísticas**: Contadores por estado

### 3. Gestión de Postulantes
- **Listar postulantes**: Tabla con todos los postulantes
- **Ver perfil**: Detalles completos del postulante
- **Contactar**: Enviar email al postulante
- **Cambiar estado**: Nuevo → En revisión → Aceptado/Rechazado
- **Filtros**: Por oferta, estado y búsqueda
- **Exportar CSV**: Descargar lista de postulantes

## 🔧 Módulos JavaScript

### CompanyConfig.js
Configuración centralizada del sistema:
- **API endpoints**: URLs para integración con Django
- **Datos mock**: Datos de desarrollo (reemplazar con API)
- **Mensajes**: Textos de éxito/error
- **Formatters**: Funciones de formateo (números, fechas)

```javascript
// Ejemplo de uso
CompanyConfig.api.endpoints.myOffers
CompanyConfig.messages.success.saved
CompanyConfig.formatters.formatNumber(1234)
```

### CompanyUI.js
Manejo de interacciones de interfaz:
- **Sidebar**: Toggle en móvil, navegación
- **Modales**: Abrir/cerrar
- **Toasts**: Notificaciones temporales
- **Loader**: Spinner de carga
- **Responsive**: Adaptación a diferentes pantallas

```javascript
// Ejemplos de uso
CompanyUI.showToast('Mensaje', 'success');
CompanyUI.showLoader(true);
CompanyUI.confirm('¿Estás seguro?');
```

### CompanyRouter.js
Sistema de navegación SPA:
- **Rutas**: `/`, `/ofertas`, `/ofertas/nueva`, `/postulantes`
- **Navegación**: Sin recargar página
- **Historial**: Soporte para botones back/forward del navegador
- **Renderizado**: Carga dinámica de vistas

```javascript
// Ejemplo de uso
CompanyRouter.navigate('/ofertas');
```

### CompanyDashboard.js
Lógica del dashboard:
- **Renderizar estadísticas**: Cards con métricas
- **Actividad reciente**: Lista de acciones
- **Acciones rápidas**: Botones de acceso directo

### CompanyOffers.js
Gestión completa de ofertas:
- **CRUD**: Crear, leer, actualizar, eliminar
- **Filtros**: Por estado y búsqueda
- **Estadísticas**: Contadores dinámicos
- **Publicación**: Cambiar estado de borradores

```javascript
// Ejemplos de uso
CompanyOffers.loadOffers();
CompanyOffers.publishOffer(offerId);
CompanyOffers.getStats();
```

### CompanyApplicants.js
Gestión de postulantes:
- **Listar**: Con filtros avanzados
- **Ver perfil**: Detalles completos
- **Actualizar estado**: Workflow de revisión
- **Exportar**: Generar CSV
- **Contactar**: Email directo

```javascript
// Ejemplos de uso
CompanyApplicants.loadApplicants();
CompanyApplicants.updateStatus(id, 'accepted');
CompanyApplicants.exportToCSV();
```

## 🔌 Integración con Django

### Endpoints Preparados

Todos los módulos tienen marcadores `TODO` donde se deben reemplazar los datos mock con llamadas reales a la API:

```javascript
// Ejemplo en CompanyOffers.js
async loadOffers() {
  try {
    CompanyUI.showLoader(true);
    
    // TODO: Reemplazar con llamada real
    // const data = await apiRequest(CompanyConfig.api.endpoints.myOffers);
    // this.offers = data;
    
    // Datos mock por ahora
    this.offers = this.getMockOffers();
    
    CompanyUI.showLoader(false);
  } catch (error) {
    console.error('Error:', error);
    CompanyUI.showToast(CompanyConfig.messages.errors.network, 'error');
  }
}
```

### Función Helper API

Ya incluida en `CompanyConfig.js`:

```javascript
async function apiRequest(endpoint, options = {}) {
  const url = `${CompanyConfig.api.baseURL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...CompanyConfig.api.headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}
```

### Pasos para Integración

1. **Configurar baseURL** en `CompanyConfig.js`
2. **Agregar autenticación** (tokens en headers)
3. **Reemplazar datos mock** con llamadas a `apiRequest()`
4. **Manejar errores** específicos del backend
5. **Probar endpoints** uno por uno

## 🎨 Personalización CSS

### Variables CSS
Modificar en `CompanyVariables.css`:

```css
:root {
  --company-primary: #1976d2;
  --company-secondary: #424242;
  --company-success: #4caf50;
  --company-error: #f44336;
  --company-warning: #ff9800;
  --company-info: #2196f3;
}
```

### Componentes Reutilizables
- `.company-button` (primary, outline, ghost)
- `.company-card`
- `.company-table`
- `.company-badge`
- `.company-form-input`, `.company-form-select`, `.company-form-textarea`

## 📱 Responsive Design

- **Mobile**: < 768px (sidebar colapsable)
- **Tablet**: 768px - 992px
- **Desktop**: > 992px

## 🚀 Cómo Usar

1. **Abrir** `CompanyPanel.html` en el navegador
2. **Navegar** usando el menú lateral
3. **Interactuar** con ofertas y postulantes
4. **Datos mock** se cargan automáticamente

## ✅ Checklist de Integración

- [ ] Configurar URL base de la API
- [ ] Implementar autenticación (JWT/Session)
- [ ] Reemplazar mock data en CompanyOffers
- [ ] Reemplazar mock data en CompanyApplicants
- [ ] Reemplazar mock data en CompanyDashboard
- [ ] Implementar formulario de creación de ofertas
- [ ] Implementar modal de perfil de postulante
- [ ] Agregar validación de formularios
- [ ] Probar flujo completo de ofertas
- [ ] Probar flujo completo de postulantes

## 🐛 Debugging

Todos los módulos incluyen `console.log()` para debugging:

```javascript
console.log('CompanyOffers inicializado');
console.log('Ver oferta:', offer);
```

Abrir **DevTools** (F12) para ver logs y errores.

## 📝 Notas Importantes

1. **Datos Mock**: Actualmente usa datos de prueba. Reemplazar con API real.
2. **Sin Backend**: Funciona standalone para desarrollo frontend.
3. **Modular**: Cada módulo es independiente y reutilizable.
4. **Vanilla JS**: No requiere frameworks (React, Vue, etc.).
5. **SPA**: Navegación sin recargar página.

## 🔗 Relación con Panel Admin

El panel de compañía sigue la misma arquitectura que el panel de admin (`AdminPanel.html`), pero con funcionalidades específicas para empresas:

- **Admin**: Gestiona usuarios, empresas, estudiantes, ofertas globales
- **Company**: Gestiona solo sus ofertas y postulantes

## 📞 Soporte

Para dudas o problemas, revisar:
1. Console del navegador (F12)
2. Comentarios en el código
3. Marcadores TODO para integración
