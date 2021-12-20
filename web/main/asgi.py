"""
ASGI config for main project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
import sys
import dotenv

from django.core.asgi import get_asgi_application

import pymysql
pymysql.install_as_MySQLdb()

dotenv.load_dotenv(
        os.path.join(os.path.dirname(__file__), '.env')
    )

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')

application = get_asgi_application()
