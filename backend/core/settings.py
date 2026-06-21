from pathlib import Path
from datetime import timedelta
import dj_database_url
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

# ─── Core Settings ─────────────────────────────────────────────
SECRET_KEY = config('SECRET_KEY')
PRODUCTION = config('PRODUCTION', default=False, cast=bool)
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'cloudinary_storage',
    'django.contrib.staticfiles',
    'cloudinary',
    'rest_framework_simplejwt.token_blacklist',
    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    # Local apps
    'users',
    'products',
    'orders',
    'payments',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [],
    'APP_DIRS': True,
    'OPTIONS': {
        'context_processors': [
            'django.template.context_processors.debug',
            'django.template.context_processors.request',
            'django.contrib.auth.context_processors.auth',
            'django.contrib.messages.context_processors.messages',
        ]
    },
}]

WSGI_APPLICATION = 'core.wsgi.application'

# ─── Database ───────────────────────────────────────────────────
if PRODUCTION:
    DATABASES = {
        'default': dj_database_url.parse(
            config('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': config('DB_NAME'),
            'USER': config('DB_USER'),
            'PASSWORD': config('DB_PASSWORD'),
            'HOST': config('DB_HOST'),
            'PORT': config('DB_PORT'),
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Dhaka'
USE_I18N = True
USE_TZ = True

# ─── Static & Media ─────────────────────────────────────────────
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

if PRODUCTION:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME'),
        'API_KEY': config('CLOUDINARY_API_KEY'),
        'API_SECRET': config('CLOUDINARY_API_SECRET'),
    }
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# ─── REST Framework ──────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# ─── CORS ────────────────────────────────────────────────────────
if PRODUCTION:
    CORS_ALLOWED_ORIGINS = [
        config('FRONTEND_URL', default='http://localhost:5173'),
    ]
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:5173',
    ]

# ─── Email ───────────────────────────────────────────────────────
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # for development
DEFAULT_FROM_EMAIL = 'noreply@GrandTaste.com'

# For production with Gmail:
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = config('EMAIL_HOST_USER')
# EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')

# ─── SSLCommerz ──────────────────────────────────────────────────
SSLCOMMERZ_STORE_ID = config('SSLCOMMERZ_STORE_ID', default='testbox')
SSLCOMMERZ_STORE_PASSWORD = config('SSLCOMMERZ_STORE_PASSWORD', default='qwerty')
SSLCOMMERZ_IS_SANDBOX = config('SSLCOMMERZ_IS_SANDBOX', default=True, cast=bool)

# ─── Admin Branding ──────────────────────────────────────────────
ADMIN_SITE_HEADER = "GrandTaste Admin"
ADMIN_SITE_TITLE = "GrandTaste"