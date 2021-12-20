from django.db import models
from django.utils import timezone


class Contact(models.Model):
    """
    Models for contact forms
    """
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    subject = models.CharField(max_length=256)
    message = models.TextField(max_length=2000)
    received_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject

        

class Lead(models.Model):
    email = models.EmailField(max_length=32, unique=True)
    registered_on = models.DateField(auto_now=True, verbose_name="Registration Date")

    def __str__(self):
        return self.email


class CrytoNew(models.Model):
    id=models.BigIntegerField(unique=True, primary_key=True)
    guid = models.CharField(max_length=256)
    imageurl = models.CharField(max_length=256)
    title = models.CharField(max_length=256)
    description = models.TextField(max_length=2000)
    url = models.TextField(max_length=2000)
    published_on = models.DateTimeField()



    def __str__(self):
        return self.description

    class Meta:
        ordering = ['-published_on']


