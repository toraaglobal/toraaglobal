from django.db import models
from django.utils import timezone
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

    def __str__(self):
        return self.subject





class Lead(models.Model):
    email = models.EmailField(max_length=32, unique=True)
    registered_on = models.DateField(auto_now=True, verbose_name="Registration Date")

    def __str__(self):
        return self.email