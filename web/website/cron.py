from decimal import Decimal
import datetime
import requests
from bs4 import BeautifulSoup
import json 

from .models import CrytoNew



def seed_crypto_new():
    api_request = requests.get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')
    api = json.loads(api_request.content)
    for x in api['Data']:
        CrytoNew.objects.create(
            id=int(x['id']),
            guid = x['guid'],
            imageurl = x['imageurl'],
            title = x['title'],
            description = x['body'],
            url = x['url'],
            published_on = datetime.datetime.fromtimestamp(x['published_on'])
        )

