from django.shortcuts import render
from django.contrib import messages
from django.views import View
import json 
import requests

import datetime


from . import models



def website_home(request):
    template_name = 'website/home.html'
    price_request = requests.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BCH,XRP,LTC,XEM,NEO,XLM,IOTADA&tsyms=USD')
    price = json.loads(price_request.content)

    api_request = requests.get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')
    api = json.loads(api_request.content)


    if request.method == "POST":
        data = request.POST
        email = data['email'].strip()
        if (not email) or (not '@' in email):
            messages.error(request, 'Please enter a valid email address')
            return render(request, template_name)
        try:
            models.Lead.objects.create(
                email = data['email'],
            )
            messages.success(request, 'Thank you for your interest. We will update you once we are done.')
            return render(request, template_name)
        except:
            messages.info(request, 'You are already registered. We will update you once we are done.')
            return render(request, template_name)

    # rt = str(exchange_rates[0]).split('=')[1] #
    context = {'price': price, 'api': api }
    return render(request, template_name, context=context)


def website_contact(request):
    template_name = 'website/contact.html'
    api_request = requests.get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')
    api = json.loads(api_request.content)
    context = {'api': api}

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
    api_request = requests.get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')
    api = json.loads(api_request.content)
    context = {'api': api}
    return render(request, template_name, context=context)


def website_about(request):
    template_name = 'website/about.html'
    api_request = requests.get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')
    api = json.loads(api_request.content)
    exchange_rates = get_exchange_rate()
    # rt = str(exchange_rates[0]).split('=')[1] #
    for exchange_rate in exchange_rates:
        if exchange_rate.send_currency.code=="USD" and exchange_rate.receive_currency.code=="NGN":
            ngn_rate = exchange_rate

    context = {'exchange_rates': exchange_rates, 'ngn_rate' : ngn_rate,'api': api }
    return render(request, template_name, context=context)


def website_exchange(request):
    template_name = 'website/exchange.html'
    exchange_rates = get_exchange_rate()
    api_request = requests.get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')
    api = json.loads(api_request.content)

    currencies = Currency.objects.all()
    send_currencies = currencies.filter(can_send=True)
    receive_currencies = currencies.filter(can_receive=True)

    context = {
        'exchange_rates': exchange_rates,
        'send_currencies': send_currencies,
        'receive_currencies': receive_currencies,
        'api': api
    }
    return render(request, template_name, context=context)



def website_web_terminal(request):
    return render(request, 'website/webterminal.html', {})


def website_blog(request):
    api_request = requests.get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')
    api = json.loads(api_request.content)
    return render(request, 'website/blog.html', {'api' : api} )




