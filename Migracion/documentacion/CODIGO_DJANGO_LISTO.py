# ============================================
# CÓDIGO DJANGO LISTO PARA COPIAR Y PEGAR
# ============================================
# Este archivo contiene código completo y funcional
# para integrar con el frontend del Panel de Administrador

# ============================================
# 1. MODELOS (apps/users/models.py)
# ============================================

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
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'user_type']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} ({self.get_user_type_display()})"


# ============================================
# 2. SERIALIZERS (apps/users/serializers.py)
# ============================================

from rest_framework import serializers
from .models import User

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


# ============================================
# 3. VIEWSETS (apps/users/views.py)
# ============================================

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.http import HttpResponse
import csv

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


# ============================================
# 4. URLS (apps/users/urls.py)
# ============================================

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]


# ============================================
# 5. URLS PRINCIPALES (config/urls.py)
# ============================================

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
        # path('offers/', include('apps.offers.urls')),
        # path('reports/', include('apps.reports.urls')),
        # path('dashboard/', include('apps.dashboard.urls')),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


# ============================================
# 6. SETTINGS MÍNIMO (config/settings.py)
# ============================================

"""
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    
    # Local apps
    'apps.users',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # IMPORTANTE: Antes de CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Custom User Model
AUTH_USER_MODEL = 'users.User'

# REST Framework
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
}

# JWT
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
}

# CORS
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:5500',  # Live Server
]

CORS_ALLOW_CREDENTIALS = True
"""


# ============================================
# 7. COMANDOS PARA EJECUTAR
# ============================================

"""
# 1. Instalar dependencias
pip install djangorestframework djangorestframework-simplejwt django-cors-headers django-filter

# 2. Crear migraciones
python manage.py makemigrations

# 3. Aplicar migraciones
python manage.py migrate

# 4. Crear superusuario
python manage.py createsuperuser

# 5. Correr servidor
python manage.py runserver

# 6. Probar endpoint
curl http://localhost:8000/api/v1/users/
"""


# ============================================
# 8. EJEMPLO DE PRUEBA CON CURL
# ============================================

"""
# Login
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'

# Respuesta:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

# Listar usuarios (con token)
curl -X GET http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."

# Crear usuario
curl -X POST http://localhost:8000/api/v1/users/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test",
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User",
    "user_type": "student"
  }'

# Obtener estadísticas
curl -X GET http://localhost:8000/api/v1/users/stats/ \
  -H "Authorization: Bearer TOKEN"
"""


# ============================================
# 9. ADMIN.PY (apps/users/admin.py)
# ============================================

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'user_type', 'is_active', 'created_at']
    list_filter = ['user_type', 'is_active', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Información Adicional', {
            'fields': ('user_type', 'phone', 'avatar')
        }),
    )


# ============================================
# 10. REQUIREMENTS.TXT
# ============================================

"""
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.0
django-filter==23.3
Pillow==10.1.0
python-decouple==3.8
psycopg2-binary==2.9.9
"""


# ============================================
# FIN DEL CÓDIGO
# ============================================
# Este código está listo para usar.
# Solo copia y pega en los archivos correspondientes.
