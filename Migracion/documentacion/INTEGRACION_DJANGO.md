# 🔗 Guía de Integración con Django REST Framework

## 📋 Tabla de Contenidos

1. [Estructura del Backend Django](#estructura-del-backend-django)
2. [Configuración de Django](#configuración-de-django)
3. [Modelos Requeridos](#modelos-requeridos)
4. [Serializers](#serializers)
5. [Views y ViewSets](#views-y-viewsets)
6. [URLs](#urls)
7. [Autenticación JWT](#autenticación-jwt)
8. [CORS Configuration](#cors-configuration)
9. [Integración del Frontend](#integración-del-frontend)
10. [Testing](#testing)

---

## 1. Estructura del Backend Django

```
backend/
├── manage.py
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── users/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── offers/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── reports/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── dashboard/
│       ├── views.py
│       └── urls.py
└── requirements.txt
```

---

## 2. Configuración de Django

### requirements.txt

```txt
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.0
django-filter==23.3
Pillow==10.1.0
python-decouple==3.8
psycopg2-binary==2.9.9
```

### settings.py

```python
# config/settings.py

import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')

DEBUG = os.getenv('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'tu-dominio.com']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    
    # Local apps
    'apps.users',
    'apps.offers',
    'apps.reports',
    'apps.dashboard',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS debe estar antes de CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'practicas_db'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'password'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'users.User'

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DATETIME_FORMAT': '%Y-%m-%d %H:%M:%S',
    'DATE_FORMAT': '%Y-%m-%d',
}

# JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080',
    # Agregar tu dominio en producción
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

---

## 3. Modelos Requeridos

### apps/users/models.py

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Modelo de usuario personalizado"""
    
    USER_TYPE_CHOICES = [
        ('student', 'Estudiante'),
        ('company', 'Empresa'),
        ('admin', 'Administrador'),
    ]
    
    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    # Campos adicionales según tipo de usuario
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'user_type']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} ({self.get_user_type_display()})"


class Student(models.Model):
    """Perfil de estudiante"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    student_id = models.CharField(max_length=20, unique=True)
    program = models.CharField(max_length=100)
    semester = models.IntegerField()
    
    class Meta:
        db_table = 'students'
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.student_id}"


class Company(models.Model):
    """Perfil de empresa"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company_profile')
    company_name = models.CharField(max_length=200)
    nit = models.CharField(max_length=20, unique=True)
    description = models.TextField()
    website = models.URLField(blank=True)
    address = models.CharField(max_length=255)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'companies'
        verbose_name_plural = 'Companies'
    
    def __str__(self):
        return self.company_name
```

### apps/offers/models.py

```python
from django.db import models
from apps.users.models import Company

class Offer(models.Model):
    """Modelo de oferta de práctica"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('approved', 'Aprobada'),
        ('rejected', 'Rechazada'),
        ('closed', 'Cerrada'),
    ]
    
    MODALITY_CHOICES = [
        ('presential', 'Presencial'),
        ('remote', 'Remoto'),
        ('hybrid', 'Híbrido'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='offers')
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField()
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration = models.IntegerField(help_text='Duración en meses')
    location = models.CharField(max_length=255)
    modality = models.CharField(max_length=20, choices=MODALITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_offers')
    
    class Meta:
        db_table = 'offers'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.company.company_name}"


class Application(models.Model):
    """Modelo de postulación a oferta"""
    
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('accepted', 'Aceptada'),
        ('rejected', 'Rechazada'),
    ]
    
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name='applications')
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField()
    resume = models.FileField(upload_to='resumes/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'applications'
        ordering = ['-created_at']
        unique_together = ['offer', 'student']
    
    def __str__(self):
        return f"{self.student.user.get_full_name()} -> {self.offer.title}"
```

### apps/reports/models.py

```python
from django.db import models
from apps.users.models import User

class Report(models.Model):
    """Modelo de reporte generado"""
    
    TYPE_CHOICES = [
        ('activity', 'Actividad de usuarios'),
        ('offers', 'Ofertas publicadas'),
        ('applications', 'Postulaciones'),
        ('users', 'Usuarios registrados'),
        ('companies', 'Empresas registradas'),
    ]
    
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
    ]
    
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES)
    file = models.FileField(upload_to='reports/')
    start_date = models.DateField()
    end_date = models.DateField()
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reports'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_format_display()}"
```

---

## 4. Serializers

### apps/users/serializers.py

```python
from rest_framework import serializers
from .models import User, Student, Company

class UserSerializer(serializers.ModelSerializer):
    """Serializer para el modelo User"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'user_type', 'is_active', 'phone', 'avatar',
            'created_at', 'updated_at', 'last_login'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear usuarios"""
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'user_type', 'phone'
        ]
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Company
        fields = '__all__'
```

### apps/offers/serializers.py

```python
from rest_framework import serializers
from .models import Offer, Application
from apps.users.serializers import CompanySerializer

class OfferSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.company_name', read_only=True)
    applications_count = serializers.IntegerField(source='applications.count', read_only=True)
    
    class Meta:
        model = Offer
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'approved_at', 'approved_by']


class OfferDetailSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    applications_count = serializers.IntegerField(source='applications.count', read_only=True)
    
    class Meta:
        model = Offer
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    offer_title = serializers.CharField(source='offer.title', read_only=True)
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
```

---

## 5. Views y ViewSets

### apps/users/views.py

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count, Q
import csv
from django.http import HttpResponse

from .models import User
from .serializers import UserSerializer, UserCreateSerializer

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de usuarios"""
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user_type', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email', 'user_type']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estadísticas de usuarios"""
        total = User.objects.count()
        active = User.objects.filter(is_active=True).count()
        students = User.objects.filter(user_type='student').count()
        companies = User.objects.filter(user_type='company').count()
        admins = User.objects.filter(user_type='admin').count()
        
        return Response({
            'total': total,
            'active': active,
            'inactive': total - active,
            'students': students,
            'companies': companies,
            'admins': admins,
        })
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """Exportar usuarios a CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="usuarios.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Nombre', 'Email', 'Tipo', 'Estado', 'Fecha Registro'])
        
        users = self.filter_queryset(self.get_queryset())
        for user in users:
            writer.writerow([
                user.id,
                user.get_full_name(),
                user.email,
                user.get_user_type_display(),
                'Activo' if user.is_active else 'Inactivo',
                user.created_at.strftime('%Y-%m-%d'),
            ])
        
        return response
```

### apps/offers/views.py

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone

from .models import Offer
from .serializers import OfferSerializer, OfferDetailSerializer

class OfferViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de ofertas"""
    queryset = Offer.objects.select_related('company').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'modality', 'company']
    search_fields = ['title', 'company__company_name', 'description']
    ordering_fields = ['created_at', 'title', 'salary']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return OfferDetailSerializer
        return OfferSerializer
    
    def get_permissions(self):
        if self.action in ['approve', 'reject', 'stats']:
            return [IsAuthenticated(), IsAdminUser()]
        return super().get_permissions()
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Aprobar una oferta"""
        offer = self.get_object()
        
        if offer.status != 'pending':
            return Response(
                {'error': 'Solo se pueden aprobar ofertas pendientes'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        offer.status = 'approved'
        offer.approved_at = timezone.now()
        offer.approved_by = request.user
        offer.save()
        
        serializer = self.get_serializer(offer)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Rechazar una oferta"""
        offer = self.get_object()
        reason = request.data.get('reason', '')
        
        if not reason:
            return Response(
                {'error': 'Debe proporcionar un motivo de rechazo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        offer.status = 'rejected'
        offer.rejection_reason = reason
        offer.save()
        
        serializer = self.get_serializer(offer)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estadísticas de ofertas"""
        total = Offer.objects.count()
        pending = Offer.objects.filter(status='pending').count()
        approved = Offer.objects.filter(status='approved').count()
        rejected = Offer.objects.filter(status='rejected').count()
        closed = Offer.objects.filter(status='closed').count()
        
        return Response({
            'total': total,
            'pending': pending,
            'approved': approved,
            'rejected': rejected,
            'closed': closed,
        })
```

### apps/dashboard/views.py

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

from apps.users.models import User
from apps.offers.models import Offer, Application

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def dashboard_stats(request):
    """Estadísticas generales del dashboard"""
    
    total_users = User.objects.count()
    pending_offers = Offer.objects.filter(status='pending').count()
    active_internships = Application.objects.filter(status='accepted').count()
    
    return Response({
        'totalUsers': total_users,
        'pendingOffers': pending_offers,
        'activeInternships': active_internships,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def recent_activity(request):
    """Actividad reciente del sistema"""
    limit = int(request.GET.get('limit', 10))
    
    # Obtener actividades recientes (últimos 7 días)
    seven_days_ago = timezone.now() - timedelta(days=7)
    
    activities = []
    
    # Nuevos usuarios
    new_users = User.objects.filter(created_at__gte=seven_days_ago).order_by('-created_at')[:limit]
    for user in new_users:
        activities.append({
            'id': f'user_{user.id}',
            'description': f'Nuevo usuario registrado: {user.get_full_name()}',
            'time': user.created_at.isoformat(),
            'timestamp': user.created_at.isoformat(),
        })
    
    # Nuevas ofertas
    new_offers = Offer.objects.filter(created_at__gte=seven_days_ago).order_by('-created_at')[:limit]
    for offer in new_offers:
        activities.append({
            'id': f'offer_{offer.id}',
            'description': f'Oferta "{offer.title}" publicada por {offer.company.company_name}',
            'time': offer.created_at.isoformat(),
            'timestamp': offer.created_at.isoformat(),
        })
    
    # Ordenar por timestamp
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    
    return Response(activities[:limit])
```

---

## 6. URLs

### config/urls.py

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include([
        # Autenticación
        path('auth/', include([
            path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
            path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        ])),
        
        # Apps
        path('users/', include('apps.users.urls')),
        path('offers/', include('apps.offers.urls')),
        path('reports/', include('apps.reports.urls')),
        path('dashboard/', include('apps.dashboard.urls')),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```

### apps/users/urls.py

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]
```

### apps/offers/urls.py

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OfferViewSet

router = DefaultRouter()
router.register(r'', OfferViewSet, basename='offer')

urlpatterns = [
    path('', include(router.urls)),
]
```

### apps/dashboard/urls.py

```python
from django.urls import path
from .views import dashboard_stats, recent_activity

urlpatterns = [
    path('stats/', dashboard_stats, name='dashboard-stats'),
    path('activity/', recent_activity, name='recent-activity'),
]
```

---

## 7. Autenticación JWT

El frontend ya está configurado para usar JWT. En Django:

```python
# Al hacer login, Django devuelve:
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
        "id": 1,
        "email": "admin@example.com",
        "user_type": "admin"
    }
}
```

El frontend guarda el token en `localStorage` y lo envía en cada petición:
```javascript
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

---

## 8. CORS Configuration

Ya está configurado en `settings.py`. Asegúrate de agregar tu dominio de producción:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://tu-dominio.com',  # Agregar en producción
]
```

---

## 9. Integración del Frontend

### Paso 1: Actualizar AdminAPI.js

El archivo `AdminAPI.js` ya está configurado. Solo necesitas:

```javascript
// En AdminAPI.js, línea 11:
baseURL: 'http://localhost:8000/api/v1'  // Desarrollo
// O en producción:
baseURL: '/api/v1'  // Si está en el mismo dominio
```

### Paso 2: Actualizar los módulos

En cada módulo (AdminUsers.js, AdminOffers.js, etc.), descomentar las llamadas a la API:

```javascript
// ANTES (mock data):
this.state.users = this.generateMockUsers(50);

// DESPUÉS (API real):
const response = await AdminAPI.users.list(params);
this.state.users = response.results;
```

### Paso 3: Incluir AdminAPI.js en el HTML

```html
<!-- AdminPanel.html -->
<script src="js/AdminAPI.js"></script>  <!-- AGREGAR ESTA LÍNEA -->
<script src="js/AdminConfig.js"></script>
<script src="js/AdminUI.js"></script>
<!-- ... resto de scripts -->
```

---

## 10. Testing

### Test de endpoints con curl:

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'

# Listar usuarios (con token)
curl -X GET http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Crear usuario
curl -X POST http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@example.com", "password": "pass123", "user_type": "student"}'
```

---

## 🚀 Checklist de Integración

- [ ] Instalar dependencias de Django
- [ ] Configurar base de datos PostgreSQL
- [ ] Crear modelos y migraciones
- [ ] Crear serializers
- [ ] Crear views y viewsets
- [ ] Configurar URLs
- [ ] Configurar CORS
- [ ] Configurar JWT
- [ ] Crear superusuario
- [ ] Probar endpoints con Postman/curl
- [ ] Actualizar baseURL en AdminAPI.js
- [ ] Incluir AdminAPI.js en HTML
- [ ] Descomentar llamadas API en módulos
- [ ] Probar integración completa
- [ ] Configurar archivos estáticos en producción
- [ ] Configurar HTTPS en producción

---

## 📞 Comandos Útiles

```bash
# Crear proyecto Django
django-admin startproject config .

# Crear apps
python manage.py startapp apps.users
python manage.py startapp apps.offers

# Migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Correr servidor
python manage.py runserver

# Colectar archivos estáticos
python manage.py collectstatic
```

---

**¡Listo para integrar!** 🎉
