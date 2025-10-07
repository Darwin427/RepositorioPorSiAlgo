# 🎓 Sistema de Gestión de Prácticas Profesionales
## Institución Universitaria Pascual Bravo

---

## 📋 Descripción del Proyecto

Sistema web completo para la gestión de prácticas profesionales que incluye:
- **Panel de Administrador** - Gestión completa del sistema
- **Panel de Empresa** - Publicación y gestión de ofertas
- **Panel de Estudiante** - Búsqueda y postulación a ofertas

---

## 📂 Estructura del Proyecto

```
Migracion/
├── admin/                      # Panel de Administrador
│   ├── AdminPanel.html
│   ├── css/                    # Estilos del panel admin
│   └── js/                     # JavaScript modular
│       ├── AdminAPI.js         # ⭐ Capa de comunicación con Django
│       ├── AdminConfig.js
│       ├── AdminUI.js
│       ├── AdminRouter.js
│       ├── AdminDashboard.js
│       ├── AdminUsers.js       # Gestión de usuarios
│       ├── AdminOffers.js      # Supervisión de ofertas
│       └── AdminReports.js     # Generación de reportes
│
├── company/                    # Panel de Empresa
│   ├── CompanyPanel.html
│   ├── css/
│   └── js/
│
├── documentacion/              # 📚 Toda la documentación
│   ├── README_ADMIN.md         # Documentación del panel admin
│   ├── INTEGRACION_DJANGO.md   # Guía completa de integración
│   ├── GUIA_RAPIDA_INTEGRACION.md
│   ├── RESUMEN_INTEGRACION.md
│   ├── CHECKLIST_INTEGRACION.md
│   └── CODIGO_DJANGO_LISTO.py  # Código Django listo para usar
│
├── .env.example                # Variables de entorno
└── README.md                   # Este archivo
```

---

## 🚀 Estado del Proyecto

### Panel de Administrador
- ✅ **Frontend:** 100% completo y funcional
- ✅ **Integración:** 100% preparada para Django
- ✅ **Documentación:** Completa
- ⏳ **Backend Django:** Pendiente de implementación

### Panel de Empresa
- ✅ **Frontend:** 100% completo y funcional
- ⏳ **Integración con Django:** Pendiente

### Panel de Estudiante
- ⏳ **Pendiente de desarrollo**

---

## 📚 Documentación

Toda la documentación está organizada en la carpeta `documentacion/`:

### Para Desarrolladores Frontend
- 📘 **[README_ADMIN.md](documentacion/README_ADMIN.md)**
  - Documentación completa del panel de administrador
  - Funcionalidades implementadas
  - Estructura de archivos
  - Guía de uso de módulos

### Para Integración con Django
- 🔗 **[INTEGRACION_DJANGO.md](documentacion/INTEGRACION_DJANGO.md)** ⭐ PRINCIPAL
  - Guía completa con código Django (600+ líneas)
  - Modelos, Serializers, Views, URLs
  - Configuración de settings.py
  - Autenticación JWT y CORS

- 🚀 **[GUIA_RAPIDA_INTEGRACION.md](documentacion/GUIA_RAPIDA_INTEGRACION.md)**
  - Checklist de 5 pasos
  - Comandos listos para ejecutar
  - Formato de respuestas esperadas

- 📝 **[RESUMEN_INTEGRACION.md](documentacion/RESUMEN_INTEGRACION.md)**
  - Resumen ejecutivo
  - Cómo usar en desarrollo y producción
  - Debugging y errores comunes

- ✅ **[CHECKLIST_INTEGRACION.md](documentacion/CHECKLIST_INTEGRACION.md)**
  - Checklist visual paso a paso
  - Progreso y tiempo estimado

- 💻 **[CODIGO_DJANGO_LISTO.py](documentacion/CODIGO_DJANGO_LISTO.py)**
  - Código Django completo listo para copiar y pegar
  - Modelos, Serializers, Views, URLs
  - Todo en un solo archivo

---

## 🎯 Inicio Rápido

### 1. Para Desarrollo del Frontend (Sin Backend)

```bash
# Simplemente abre el archivo HTML en tu navegador
# El sistema funciona con datos mock

# Panel de Administrador
Migracion/admin/AdminPanel.html

# Panel de Empresa
Migracion/company/CompanyPanel.html
```

### 2. Para Integración con Django

**Paso 1:** Lee la documentación principal
```bash
# Abre y lee:
documentacion/INTEGRACION_DJANGO.md
```

**Paso 2:** Crea el backend Django
```bash
# Copia el código de:
documentacion/CODIGO_DJANGO_LISTO.py

# O sigue la guía paso a paso en:
documentacion/GUIA_RAPIDA_INTEGRACION.md
```

**Paso 3:** Configura el frontend
```javascript
// admin/js/AdminAPI.js - Línea 11
baseURL: 'http://localhost:8000/api/v1'
```

**Paso 4:** Descomentar llamadas API
```javascript
// En cada módulo (AdminUsers.js, AdminOffers.js, etc.)
// Buscar: // INTEGRACIÓN CON DJANGO:
// Descomentar el código de la API
```

---

## 🔧 Tecnologías Utilizadas

### Frontend
- HTML5 (Semántico y accesible)
- CSS3 (Variables CSS, Flexbox, Grid)
- JavaScript Vanilla (Sin frameworks)
- SPA Architecture (Single Page Application)

### Backend (Preparado para)
- Python 3.x
- Django 4.2+
- Django REST Framework
- PostgreSQL
- JWT Authentication

---

## 📦 Características Principales

### Panel de Administrador
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Supervisión de ofertas (aprobar/rechazar)
- ✅ Generación de reportes (PDF, Excel, CSV)
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Búsqueda y filtros avanzados
- ✅ Paginación
- ✅ Exportación de datos
- ✅ Sistema de modales dinámicos
- ✅ Responsive design

### Panel de Empresa
- ✅ Publicación de ofertas
- ✅ Gestión de postulaciones
- ✅ Dashboard de empresa
- ✅ Responsive design

---

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** para autenticación:

- Token se guarda en `localStorage`
- Se envía automáticamente en cada petición
- Refresh token para renovación automática
- Logout limpia todo el estado

---

## 🌐 Endpoints de la API

### Autenticación
```
POST   /api/v1/auth/login/
POST   /api/v1/auth/logout/
POST   /api/v1/auth/refresh/
```

### Usuarios
```
GET    /api/v1/users/
POST   /api/v1/users/
GET    /api/v1/users/{id}/
PUT    /api/v1/users/{id}/
DELETE /api/v1/users/{id}/
GET    /api/v1/users/stats/
```

### Ofertas
```
GET    /api/v1/offers/
POST   /api/v1/offers/{id}/approve/
POST   /api/v1/offers/{id}/reject/
GET    /api/v1/offers/stats/
```

### Reportes
```
GET    /api/v1/reports/
POST   /api/v1/reports/generate/
GET    /api/v1/reports/{id}/download/
```

Ver documentación completa en `documentacion/INTEGRACION_DJANGO.md`

---

## 🐛 Debugging

### Ver token guardado
```javascript
console.log(localStorage.getItem('admin_auth_token'));
```

### Probar endpoint
```javascript
AdminAPI.users.list({ page: 1 })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Ver estado de módulos
```javascript
console.log(AdminUsers.state);
console.log(AdminOffers.state);
```

---

## 📞 Soporte y Ayuda

### Errores Comunes

**Error de CORS:**
```
Access to fetch has been blocked by CORS policy
```
→ Solución: Agregar origen en `CORS_ALLOWED_ORIGINS` en Django settings.py

**Error 401:**
```
No autorizado. Por favor inicia sesión nuevamente.
```
→ Solución: Token expirado, hacer login nuevamente

**Error 404:**
```
Recurso no encontrado
```
→ Solución: Verificar que el endpoint exista en Django

Ver más en: `documentacion/RESUMEN_INTEGRACION.md`

---

## 🎯 Próximos Pasos

1. ✅ Frontend del panel de administrador - **COMPLETADO**
2. ✅ Documentación completa - **COMPLETADO**
3. ⏳ Crear backend Django - **PENDIENTE**
4. ⏳ Integrar frontend con backend - **PENDIENTE**
5. ⏳ Completar panel de empresa - **PENDIENTE**
6. ⏳ Desarrollar panel de estudiante - **PENDIENTE**
7. ⏳ Testing completo - **PENDIENTE**
8. ⏳ Despliegue en producción - **PENDIENTE**

---

## 👥 Equipo de Desarrollo

**Institución Universitaria Pascual Bravo**
- Desarrollo Frontend: Completado
- Integración Backend: En progreso
- Documentación: Completa

---

## 📄 Licencia

Este proyecto es propiedad de la Institución Universitaria Pascual Bravo.

---

## 🎉 Conclusión

**El frontend está 100% listo y documentado.**

Para comenzar la integración con Django:
1. Lee `documentacion/INTEGRACION_DJANGO.md`
2. Copia el código de `documentacion/CODIGO_DJANGO_LISTO.py`
3. Sigue el checklist en `documentacion/CHECKLIST_INTEGRACION.md`

**Tiempo estimado de integración:** 4-7 horas

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Frontend completo, listo para integración con Django
