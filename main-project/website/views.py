from django.shortcuts import render
from django.contrib import messages
from django.views import View

import datetime



from . import models

def website_home(request):
    template_name = 'website/home.html'
    context = {}
    return render(request, template_name, context=context)


def website_contact(request):
    template_name = 'website/contact.html'
    context = {}

    if request.method == "POST":
        data = request.POST
        models.Contact.objects.create(
            name = data['name'],
            email = data['email'],
            subject = data['subject'],
            message = data['message']
        )
        messages.success(request, 'Your message has been sent! Thank You')
        return render(request, template_name, context=context)    

    return render(request, template_name, context=context)


def website_services(request):
    template_name = 'website/services.html'
    context = {}   
    return render(request, template_name, context=context)


def website_about(request):
    template_name = 'website/about.html'
    context = {}
    return render(request, template_name, context=context)


