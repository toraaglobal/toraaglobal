from django.shortcuts import render
from django.contrib import messages
from datetime import datetime
from .models import *
from .forms import * 

# Create your views here.

def website_home(request):
    abouts = About.objects.all()
    portfolios = Portfolio.objects.all()
    footer_social = FooterSocial.objects.all()
    footer_address = FooterAddress.objects.all()
    profile_header = ProfileHeader.objects.all()

    form = ContactForm()

    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Thanks for contacting us, we'll get back to you soon!")

    context = {
        'form': form,
        'abouts': abouts,
        'portfolios': portfolios,
        'footer_social' : footer_social,
        'footer_address': footer_address,
        'profile_header': profile_header
        }
    return render(request, 'website/index.html', context)



def website_blog(request):
    abouts = About.objects.all()
    portfolios = Portfolio.objects.all()
    footer_social = FooterSocial.objects.all()
    footer_address = FooterAddress.objects.all()
    profile_header = ProfileHeader.objects.all()

    context = {
        'abouts': abouts,
        'portfolios': portfolios,
        'footer_social' : footer_social,
        'footer_address': footer_address,
        'profile_header': profile_header
        }

    return render(request, 'blog/index.html', context)
