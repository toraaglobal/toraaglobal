"""
Django settings for main project.

Generated by 'django-admin startproject' using Django 3.2.8.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path
import os
from django.contrib.messages import constants as messages

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG')=='True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS').split(',')


# Application definition

PREREQ_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',


]

AUTH_APPS = [
  
     'users',
    "django.contrib.sites",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
]

SITE_ID = 1

PROJECT_APPS = [
    'django_crontab',
    'rest_framework',
    'rest_framework_simplejwt',
    'django_extensions',		

    'website',
   
    'corsheaders',
    'drf_yasg',

 
]

INSTALLED_APPS = PREREQ_APPS + AUTH_APPS + PROJECT_APPS

AUTH_USER_MODEL = 'users.User'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'main.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
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

WSGI_APPLICATION = 'main.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DEV_ENV = os.environ.get('DEV_ENV') # dev, test

if DEV_ENV == "dev":
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

elif DEV_ENV == 'shared':
    #https://stackoverflow.com/questions/34777755/how-to-config-django-using-pymysql-as-driver
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql', 
            'NAME': os.environ.get('database'),
            'USER': os.environ.get('usermysql'),
            'PASSWORD': os.environ.get('passwordmysql'),
            'HOST': '127.0.0.1',
            'PORT': '3306',
        }
    }

else:
    
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': os.environ.get('dbname'), # os.environ.get('DB_NAME', 'default_value')
            'USER': os.environ.get('user'),
            'PASSWORD': os.environ.get('password'),
            'HOST': '127.0.0.1',
            'PORT': '5432',
            'OPTIONS': {'sslmode': 'prefer'},
        }
    }


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'
if DEV_ENV == 'shared':
    STATIC_ROOT = '/home/eureyjpx/remitpro.io/static/'
else:
    STATIC_ROOT = os.path.join(BASE_DIR, 'static/')

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



# Cache busting Feature
#STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'
#STATICFILES_STORAGE = 'main.storage.WhiteNoiseStaticFilesStorage'

# messages
MESSAGE_TAGS = {
    messages.DEBUG: 'alert-info',
    messages.INFO: 'alert-info',
    messages.SUCCESS: 'alert-success',
    messages.WARNING: 'alert-warning',
    messages.ERROR: 'alert-danger',
}



if DEBUG: # delete not when deploy
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
elif DEBUG==False:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.environ.get('EMAIL_HOST')
    EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS')=='True' # change it
    EMAIL_PORT = int(os.environ.get('EMAIL_PORT')) # change it
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')

    DEFAULT_FROM_EMAIL = EMAIL_HOST_USER



AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by e-mail
    'allauth.account.auth_backends.AuthenticationBackend',
]

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = True
ACCOUNT_SESSION_REMEMBER = True
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_EMAIL_VERIFICATION = 'mandatory' #'mandatory' #'optional' #'none'

# Email confirmation
ACCOUNT_EMAIL_SUBJECT_PREFIX = "[remitproinc.com]"
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True

# After 10 failed login attempts, restrict logins for 30 minutes
ACCOUNT_LOGIN_ATTEMPTS_LIMIT = 10
ACCOUNT_LOGIN_ATTEMPTS_TIMEOUT = 1800
ACCOUNT_PASSWORD_MIN_LENGTH = 8

# Other settings
# ACCOUNT_DEFAULT_HTTP_PROTOCOL = "https"
ACCOUNT_LOGIN_ON_PASSWORD_RESET = True
SOCIALACCOUNT_AUTO_SIGNUP = False

LOGIN_REDIRECT_URL = 'website_home'
ACCOUNT_LOGOUT_REDIRECT_URL = 'website_home'

ACCOUNT_FORMS = {
     'login': 'users.forms.LoginForm',
     'signup': 'users.forms.SignupForm',
     'add_email': 'allauth.account.forms.AddEmailForm',
     'change_password': 'allauth.account.forms.ChangePasswordForm',
     'set_password': 'allauth.account.forms.SetPasswordForm',
     'reset_password': 'allauth.account.forms.ResetPasswordForm',
     'reset_password_from_key': 'allauth.account.forms.ResetPasswordKeyForm',
      'disconnect': 'allauth.socialaccount.forms.DisconnectForm',
}





# cron jobs
CRONJOBS = [
    # references https://en.wikipedia.org/wiki/Cron#Format
    ('0 0 * * *', 'appboard.cron.seed_exchange_data'), # run once a day at midnight
    ('* */4 * * *', 'website.cron.seed_crypto_new'),
]




PAYSTACK_SECRET_KEY = os.environ.get('PAYSTACK_SECRET_KEY')



LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': os.environ.get("DJANGO_LOG_LEVEL"),
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR,  'debug.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': os.environ.get("DJANGO_LOG_LEVEL"),
            'propagate': True,
        },
    },
}




# Pagination for restful API
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10

}




# Media files (Images)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Crsipy forms
CRISPY_TEMPLATE_PACK = 'bootstrap4'

# Mapbox key define
MAPBOX_KEY = "pk.eyJ1IjoibWlnaHR5c2hhcmt5IiwiYSI6ImNqd2duaW4wMzBhcWI0M3F1MTRvbHB0dWcifQ.1sDAD43q0ktK1Sr374xGfw"

# Ckeditor config
CKEDITOR_JQUERY_URL = 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js'

CKEDITOR_UPLOAD_PATH = "event-details/"
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': None,
    },
}

