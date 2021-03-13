from django.urls import path
from . import views


urlpatterns = [
    path('', views.website_home, name='website_home'),
    path('about/', views.website_about, name='website_about'),
    path('services/', views.website_services, name='website_services'),
    path('contact/', views.website_contact, name='website_contact'),

]
