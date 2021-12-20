from django.urls import path
from . import views


urlpatterns = [
    path('', views.website_home, name='website_home'),
    path('about/', views.website_about, name='website_about'),
    path('services/', views.website_services, name='website_services'),
    path('contact/', views.website_contact, name='website_contact'),
     path('exchange/', views.website_exchange, name='website_exchange'),
      path('webterminal/', views.website_web_terminal, name='website_web_terminal'),
       path('blog/', views.website_blog, name='website_blog'),

]
