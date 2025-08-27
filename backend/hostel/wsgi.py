"""
WSGI config for hostel project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hostel.settings')

application = get_wsgi_application()
