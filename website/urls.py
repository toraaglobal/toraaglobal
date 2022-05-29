from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('', views.website_home, name='website_home'),
    # path('blog/', views.website_blog, name='website_blog'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
