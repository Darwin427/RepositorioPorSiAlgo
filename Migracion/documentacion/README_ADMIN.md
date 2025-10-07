# Panel de Administrador - Sistema de Gestión de Prácticas

## 📋 Descripción

Panel de administración completo para la gestión del sistema de prácticas profesionales de la Institución Universitaria Pascual Bravo. Incluye gestión de usuarios, supervisión de ofertas, generación de reportes y dashboard con estadísticas en tiempo real.

## 🚀 Funcionalidades Implementadas

### 1. **Dashboard Principal**
- Resumen general con estadísticas clave
- Tarjetas de métricas principales (usuarios, ofertas, prácticas)
- Actividad reciente del sistema
- Acciones rápidas para navegación

### 2. **Gestión de Usuarios**
- ✅ Listado completo de usuarios con paginación
- ✅ Búsqueda en tiempo real por nombre/email
- ✅ Filtros por tipo (Estudiante, Empresa, Administrador)
- ✅ Filtros por estado (Activo, Inactivo)
- ✅ Ver detalles de usuario
- ✅ Editar información de usuario
- ✅ Eliminar usuarios con confirmación
- ✅ Crear nuevos usuarios
- ✅ Exportar a CSV
- ✅ Estadísticas en tiempo real

### 3. **Supervisión de Ofertas**
- ✅ Listado de ofertas con paginación
- ✅ Búsqueda por título/empresa
- ✅ Filtros por estado (Pendiente, Aprobada, Rechazada, Cerrada)
- ✅ Ver detalles completos de oferta
- ✅ Aprobar ofertas pendientes
- ✅ Rechazar ofertas con motivo
- ✅ Exportar a CSV
- ✅ Estadísticas de ofertas

### 4. **Generación de Reportes**
- ✅ Reportes rápidos predefinidos (último mes)
- ✅ Generador personalizado con rango de fechas
- ✅ Múltiples tipos de reportes:
  - Actividad de usuarios
  - Ofertas publicadas
  - Postulaciones
  - Usuarios registrados
  - Empresas registradas
- ✅ Formatos: PDF, Excel, CSV
- ✅ Descarga de reportes generados
- ✅ Gestión de reportes históricos

## 📁 Estructura de Archivos

```
admin/
├── AdminPanel.html           # Página principal
├── css/
│   ├── AdminVariables.css    # Variables CSS
│   ├── AdminBase.css         # Estilos base
│   ├── AdminLayout.css       # Layout y estructura
│   └── AdminComponents.css   # Componentes reutilizables
├── js/
│   ├── AdminConfig.js        # Configuración global
│   ├── AdminUI.js            # Gestión de UI (modales, sidebar, etc.)
│   ├── AdminRouter.js        # Sistema de rutas SPA
│   ├── AdminDashboard.js     # Lógica del dashboard
│   ├── AdminUsers.js         # Gestión de usuarios
│   ├── AdminOffers.js        # Gestión de ofertas
│   └── AdminReports.js       # Generación de reportes
└── README_ADMIN.md           # Esta documentación
```

## 🔧 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos con variables CSS y diseño responsive
- **JavaScript (Vanilla)** - Lógica sin dependencias externas
- **SPA Architecture** - Navegación sin recarga de página
- **Material Design Icons** - Iconografía

## 🎨 Características de Diseño

- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Sidebar colapsable en móvil
- ✅ Tema basado en colores institucionales
- ✅ Animaciones suaves y transiciones
- ✅ Accesibilidad (ARIA labels, navegación por teclado)
- ✅ Feedback visual (toasts, loaders, confirmaciones)

## 📱 Responsive Breakpoints

- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: 768px - 992px
- **Wide**: > 992px

## 🔌 Integración con Backend Django

**✅ TODO ESTÁ LISTO PARA INTEGRAR CON DJANGO**

El frontend está completamente preparado para conectarse con Django REST Framework:

### Archivos de Integración Creados

1. **`AdminAPI.js`** - Capa completa de comunicación con Django
   - Manejo de autenticación JWT
   - Métodos para todos los endpoints
   - Manejo de errores automático
   - Timeout y retry logic

2. **Todos los módulos actualizados** con comentarios claros:
   - `AdminUsers.js` ✅
   - `AdminOffers.js` ✅
   - `AdminReports.js` ✅
   - `AdminDashboard.js` ✅

### Cómo Activar la Integración

**Paso 1:** Configurar Django (ver `INTEGRACION_DJANGO.md`)

**Paso 2:** Actualizar URL base en `AdminAPI.js`:
```javascript
baseURL: 'http://localhost:8000/api/v1'
```

**Paso 3:** En cada módulo, descomentar las líneas marcadas con:
```javascript
// INTEGRACIÓN CON DJANGO:
// Descomentar cuando el backend esté listo
```

**Paso 4:** Comentar o eliminar las líneas de datos mock:
```javascript
// DATOS MOCK (Remover cuando Django esté listo)
```

### Documentación Completa

- 📘 **`INTEGRACION_DJANGO.md`** - Guía completa con código Django
- 🚀 **`GUIA_RAPIDA_INTEGRACION.md`** - Checklist de 5 pasos
- 🔧 **`.env.example`** - Variables de entorno para Django

Todos los módulos están preparados para integración con Django REST API:

### Endpoints Configurados (AdminConfig.js)

```javascript
// Usuarios
GET    /api/v1/users              // Listar usuarios
GET    /api/v1/users/:id          // Detalle de usuario
POST   /api/v1/users              // Crear usuario
PUT    /api/v1/users/:id          // Actualizar usuario
DELETE /api/v1/users/:id          // Eliminar usuario

// Ofertas
GET    /api/v1/offers             // Listar ofertas
GET    /api/v1/offers/:id         // Detalle de oferta
POST   /api/v1/offers/:id/approve // Aprobar oferta
POST   /api/v1/offers/:id/reject  // Rechazar oferta

// Reportes
GET    /api/v1/reports            // Listar reportes
POST   /api/v1/reports/generate   // Generar reporte
GET    /api/v1/reports/:id/download // Descargar reporte

// Dashboard
GET    /api/v1/dashboard/stats    // Estadísticas
GET    /api/v1/dashboard/activity // Actividad reciente
```

### Cómo Integrar con Backend

1. **Actualizar baseURL en AdminConfig.js:**
```javascript
api: {
  baseURL: 'https://tu-dominio.com/api/v1',
  // ...
}
```

2. **Descomentar llamadas API en cada módulo:**
- Buscar comentarios `// TODO: Reemplazar con llamada real a la API`
- Descomentar las líneas de `apiRequest()`
- Eliminar o comentar los datos mock

3. **Agregar autenticación:**
```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
}
```

## 🎯 Uso de los Módulos

### AdminUsers - Gestión de Usuarios

```javascript
// Inicializar
AdminUsers.init();

// Cargar usuarios
await AdminUsers.loadUsers();

// Filtrar
AdminUsers.applyFilters();

// Crear usuario
AdminUsers.createUser();

// Editar usuario
AdminUsers.editUser(userId);

// Eliminar usuario
AdminUsers.deleteUser(userId);

// Exportar
AdminUsers.exportToCSV();
```

### AdminOffers - Gestión de Ofertas

```javascript
// Inicializar
AdminOffers.init();

// Aprobar oferta
AdminOffers.approveOffer(offerId);

// Rechazar oferta
AdminOffers.rejectOffer(offerId);

// Ver detalles
AdminOffers.viewOffer(offerId);
```

### AdminReports - Reportes

```javascript
// Inicializar
AdminReports.init();

// Generar reporte rápido
AdminReports.generateQuickReport('activity');

// Descargar reporte
AdminReports.downloadReport(reportId);
```

### AdminUI - Utilidades de UI

```javascript
// Mostrar toast
AdminUI.showToast('Mensaje', 'success');

// Mostrar loader
AdminUI.showLoader(true);

// Mostrar modal
AdminUI.showModal('modalId', {
  title: 'Título',
  content: '<p>Contenido HTML</p>',
  onOpen: () => { /* callback */ }
});

// Confirmar acción
const confirmed = await AdminUI.confirm('¿Estás seguro?');
```

## 🔍 Características Técnicas

### Paginación
- 10 items por página (configurable)
- Navegación con números de página
- Botones Anterior/Siguiente
- Indicador de página actual

### Búsqueda y Filtros
- Búsqueda en tiempo real (sin necesidad de botón)
- Filtros múltiples combinables
- Actualización automática de resultados
- Mantiene estado de filtros al navegar

### Modales Dinámicos
- Creación dinámica de modales
- Soporte para formularios
- Callbacks onOpen
- Cierre con ESC o backdrop
- Un solo modal abierto a la vez

### Validaciones
- Validación de formularios HTML5
- Confirmaciones antes de acciones destructivas
- Feedback visual inmediato
- Mensajes de error descriptivos

## 🐛 Debugging

Para activar logs de debugging, abre la consola del navegador:

```javascript
// Ver estado actual de usuarios
console.log(AdminUsers.state);

// Ver estado de ofertas
console.log(AdminOffers.state);

// Ver configuración global
console.log(AdminConfig);
```

## 📊 Datos Mock

Actualmente el sistema usa datos mock para desarrollo. Los datos se generan en:

- `AdminUsers.generateMockUsers(count)`
- `AdminOffers.generateMockOffers(count)`
- `AdminReports.generateMockReports()`

## 🔐 Seguridad

**Notas importantes:**

1. ⚠️ Implementar autenticación JWT en producción
2. ⚠️ Validar permisos en el backend
3. ⚠️ Sanitizar inputs antes de enviar al servidor
4. ⚠️ Usar HTTPS en producción
5. ⚠️ Implementar rate limiting en la API

## 🚀 Próximos Pasos

Para poner en producción:

1. ✅ Conectar con backend Django
2. ✅ Implementar autenticación
3. ✅ Agregar validaciones del lado del servidor
4. ✅ Optimizar carga de imágenes
5. ✅ Implementar caché de datos
6. ✅ Agregar tests unitarios
7. ✅ Configurar CI/CD

## 📞 Soporte

Para dudas o problemas:
- Revisar la consola del navegador
- Verificar que todos los archivos JS estén cargados
- Comprobar la configuración de rutas en AdminConfig.js

## 📝 Notas de Desarrollo

- Todos los módulos son independientes y pueden usarse por separado
- El sistema usa eventos nativos del DOM (no requiere frameworks)
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)
- Preparado para Progressive Web App (PWA)

---

## 📦 Archivos de Integración Incluidos

1. **`AdminAPI.js`** - Capa completa de comunicación con Django (NUEVO)
2. **`INTEGRACION_DJANGO.md`** - Guía completa con código Django (NUEVO)
3. **`GUIA_RAPIDA_INTEGRACION.md`** - Checklist de 5 pasos (NUEVO)
4. **`RESUMEN_INTEGRACION.md`** - Resumen ejecutivo (NUEVO)
5. **`CODIGO_DJANGO_LISTO.py`** - Código Django listo para copiar (NUEVO)
6. **`.env.example`** - Variables de entorno (NUEVO)

## 🎯 Estado del Proyecto

- ✅ **Frontend:** 100% completo y funcional
- ✅ **Integración:** 100% preparada para Django
- ✅ **Documentación:** Completa con ejemplos
- ⏳ **Backend:** Pendiente de implementación
- ⏳ **Despliegue:** Pendiente

---

**Desarrollado para:** Institución Universitaria Pascual Bravo  
**Versión:** 1.0.0  
**Última actualización:** Octubre 2025  
**Estado:** ✅ Listo para integración con Django
