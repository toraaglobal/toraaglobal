from django.shortcuts import render
# from django.contrib.auth.forms import UserCreationForm
from accounts.forms import Signupform
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView,View
from accounts.forms import UserEditForm,ProfileEditForm
from django.views.generic.base import TemplateView
from django.http import HttpResponse

import json 
import requests

from website.models import *
# Create your views here.
class Signup_create_view(CreateView):
    form_class = Signupform
    template_name = 'account/signup.html'
    success_url = '/blog'

class HomePageView(TemplateView):
    template_name = 'account/home.html'

    def get(self, request):
        abouts = About.objects.all()
        portfolios = Portfolio.objects.all()
        footer_social = FooterSocial.objects.all()
        footer_address = FooterAddress.objects.all()
        profile_header = ProfileHeader.objects.all()

        api_request = requests.get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')
        api = json.loads(api_request.content)

        context = {
        'abouts': abouts,
        'portfolios': portfolios,
        'footer_social' : footer_social,
        'footer_address': footer_address,
        'profile_header': profile_header,
        'api' : api
        
        }

        return render(request, self.template_name, context)


class ProfileView(LoginRequiredMixin, TemplateView):
    template_name = 'account/profile.html'


class ProfileUpdateView(LoginRequiredMixin,View):
    login_url = 'login'

    def get(self,request):
        print('GETTING HERE')
        u_form = UserEditForm(instance= request.user)
        p_form = ProfileEditForm(instance= request.user.profile)

        context = { 
            'u_form':u_form,
            'p_form':p_form
        }
        return render(request, 'account/profile_update.html',context)

    def post(self,request):
        u_form = UserEditForm(request.POST,instance= request.user)
        p_form = ProfileEditForm(request.POST,request.FILES,instance= request.user.profile)

        context = { 
            'u_form':u_form,
            'p_form':p_form
        }

        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            return render(request, 'account/profile.html',context)