# 🚀 Guía Rápida de Integración con Django

## ✅ Checklist de Integración (5 Pasos)

### 1️⃣ Configurar Django Backend

```bash
# Instalar dependencias
pip install djangorestframework djangorestframework-simplejwt django-cors-headers

# Crear migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Correr servidor
python manage.py runserver
```

### 2️⃣ Configurar CORS en Django

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:5500',  # Live Server de VS Code
]
```

### 3️⃣ Actualizar URL de la API en el Frontend

```javascript
// Migracion/admin/js/AdminAPI.js - Línea 11
baseURL: 'http://localhost:8000/api/v1'  // Cambiar según tu configuración
```

### 4️⃣ Descomentar Llamadas a la API

En cada módulo (AdminUsers.js, AdminOffers.js, AdminReports.js, AdminDashboard.js):

**Buscar:**
```javascript
// INTEGRACIÓN CON DJANGO:
// Descomentar cuando el backend esté listo
/*
const response = await AdminAPI.users.list(params);
...
*/
```

**Descomentar:**
```javascript
// INTEGRACIÓN CON DJANGO:
const response = await AdminAPI.users.list(params);
this.state.users = response.results;
```

**Comentar o eliminar:**
```javascript
// DATOS MOCK (Remover cuando Django esté listo)
// this.state.users = this.generateMockUsers(50);
```

### 5️⃣ Probar la Integración

```bash
# 1. Verificar que Django esté corriendo
curl http://localhost:8000/api/v1/users/

# 2. Abrir el panel en el navegador
# Abrir: Migracion/admin/AdminPanel.html

# 3. Verificar en la consola del navegador
# No debe haber errores de CORS o 404
```

---

## 📂 Archivos Clave

### Frontend (Ya Listos)
- ✅ `AdminAPI.js` - Capa de comunicación con Django
- ✅ `AdminUsers.js` - Gestión de usuarios (preparado)
- ✅ `AdminOffers.js` - Gestión de ofertas (preparado)
- ✅ `AdminReports.js` - Generación de reportes (preparado)
- ✅ `AdminDashboard.js` - Dashboard (preparado)

### Backend (Por Crear)
- ⚠️ `apps/users/models.py` - Modelos de usuarios
- ⚠️ `apps/users/serializers.py` - Serializers
- ⚠️ `apps/users/views.py` - ViewSets
- ⚠️ `apps/offers/models.py` - Modelos de ofertas
- ⚠️ `apps/offers/views.py` - ViewSets
- ⚠️ `apps/reports/models.py` - Modelos de reportes
- ⚠️ `apps/dashboard/views.py` - Vistas del dashboard

---

## 🔌 Endpoints Esperados por el Frontend

### Autenticación
```
POST   /api/v1/auth/login/     - Login
POST   /api/v1/auth/logout/    - Logout
POST   /api/v1/auth/refresh/   - Refresh token
GET    /api/v1/auth/me/        - Usuario actual
```

### Usuarios
```
GET    /api/v1/users/          - Listar usuarios (con paginación)
POST   /api/v1/users/          - Crear usuario
GET    /api/v1/users/{id}/     - Detalle de usuario
PUT    /api/v1/users/{id}/     - Actualizar usuario
DELETE /api/v1/users/{id}/     - Eliminar usuario
GET    /api/v1/users/stats/    - Estadísticas
GET    /api/v1/users/export/   - Exportar CSV
```

### Ofertas
```
GET    /api/v1/offers/             - Listar ofertas
POST   /api/v1/offers/             - Crear oferta
GET    /api/v1/offers/{id}/        - Detalle de oferta
POST   /api/v1/offers/{id}/approve/ - Aprobar oferta
POST   /api/v1/offers/{id}/reject/  - Rechazar oferta
GET    /api/v1/offers/stats/       - Estadísticas
```

### Reportes
```
GET    /api/v1/reports/                - Listar reportes
POST   /api/v1/reports/generate/       - Generar reporte
GET    /api/v1/reports/{id}/           - Detalle de reporte
GET    /api/v1/reports/{id}/download/  - Descargar reporte
DELETE /api/v1/reports/{id}/           - Eliminar reporte
```

### Dashboard
```
GET    /api/v1/dashboard/stats/    - Estadísticas generales
GET    /api/v1/dashboard/activity/ - Actividad reciente
```

---

## 📊 Formato de Respuestas Esperadas

### Lista con Paginación
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/v1/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "email": "user@example.com",
      "first_name": "Juan",
      "last_name": "Pérez",
      "user_type": "student",
      "is_active": true,
      "created_at": "2025-10-01T10:00:00Z"
    }
  ]
}
```

### Estadísticas del Dashboard
```json
{
  "totalUsers": 1245,
  "pendingOffers": 32,
  "activeInternships": 187
}
```

### Actividad Reciente
```json
[
  {
    "id": "user_1",
    "description": "Nuevo usuario registrado: Juan Pérez",
    "time": "2025-10-06T19:00:00Z",
    "timestamp": "2025-10-06T19:00:00Z"
  }
]
```

---

## 🔐 Autenticación JWT

### 1. Login
```javascript
const response = await AdminAPI.auth.login('admin@example.com', 'password');
// Guarda automáticamente el token en localStorage
```

### 2. Token se envía automáticamente
```javascript
// AdminAPI.js agrega automáticamente el header:
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### 3. Logout
```javascript
await AdminAPI.auth.logout();
// Limpia el token y redirige al login
```

---

## 🐛 Debugging

### Ver token guardado
```javascript
console.log(localStorage.getItem('admin_auth_token'));
```

### Ver datos del usuario
```javascript
console.log(AdminAPI.getUserData());
```

### Probar endpoint manualmente
```javascript
AdminAPI.users.list({ page: 1, page_size: 10 })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Ver todas las peticiones en la consola
```javascript
// Las peticiones fallidas se muestran automáticamente en la consola
// con detalles del error
```

---

## ⚠️ Errores Comunes

### 1. Error de CORS
```
Access to fetch at 'http://localhost:8000/api/v1/users/' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```
**Solución:** Agregar el origen en `CORS_ALLOWED_ORIGINS` en Django settings.py

### 2. Error 401 (No autorizado)
```
Error: No autorizado. Por favor inicia sesión nuevamente.
```
**Solución:** El token expiró o no es válido. Hacer login nuevamente.

### 3. Error 404 (No encontrado)
```
Error: Recurso no encontrado.
```
**Solución:** Verificar que la URL del endpoint sea correcta y que exista en Django.

### 4. Error de red
```
Error: La petición tardó demasiado tiempo. Verifica tu conexión.
```
**Solución:** Verificar que Django esté corriendo y que la URL base sea correcta.

---

## 📝 Ejemplo Completo de Integración

### Antes (Mock Data)
```javascript
// AdminUsers.js
async loadUsers() {
  this.state.users = this.generateMockUsers(50);
  this.render();
}
```

### Después (API Real)
```javascript
// AdminUsers.js
async loadUsers() {
  try {
    AdminUI.showLoader(true);
    
    const params = {
      page: this.state.currentPage,
      page_size: this.state.itemsPerPage,
      search: this.state.filters.search,
    };
    
    const response = await AdminAPI.users.list(params);
    this.state.users = response.results;
    this.state.totalPages = Math.ceil(response.count / this.state.itemsPerPage);
    
    this.render();
    AdminUI.showLoader(false);
  } catch (error) {
    console.error('Error:', error);
    AdminUI.showToast('Error al cargar usuarios', 'error');
    AdminUI.showLoader(false);
  }
}
```

---

## 🎯 Próximos Pasos

1. ✅ Crear modelos en Django (ver `INTEGRACION_DJANGO.md`)
2. ✅ Crear serializers
3. ✅ Crear views y viewsets
4. ✅ Configurar URLs
5. ✅ Probar endpoints con Postman
6. ✅ Descomentar llamadas API en el frontend
7. ✅ Probar integración completa
8. ✅ Desplegar en producción

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs de Django
3. Verifica que CORS esté configurado correctamente
4. Verifica que el token JWT sea válido
5. Consulta `INTEGRACION_DJANGO.md` para más detalles

---

**¡Todo está listo para la integración! 🎉**
