from django.db import models
from .validator import validate_file_extension

# Create your models here.
class Contact(models.Model):
    """
    Models for contact forms
    """
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    phone = models.CharField(max_length=50)
    message = models.TextField(max_length=2000)
    received_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

    class Meta:
        ordering = ['-id', ]


class Volunteer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    occupation = models.CharField(max_length=255)
    picture = models.ImageField(upload_to='volunteer_images/')
    description = models.TextField()
    is_approved = models.BooleanField(default = True)
    creation_time = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update_time = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return str(self.name)


class Portfolio(models.Model):
    """
    Portfolio model 
    """
    title = models.CharField(max_length=255)
    picture = models.ImageField(upload_to='portfolio_images/')
    portfolio = models.FileField(upload_to='portfolio_files/',null=True, validators=[validate_file_extension])
    content = models.TextField()
    target = models.CharField(max_length=255)
    portfolio_link = models.URLField()

    class Meta:
        ordering = ['-id', ]


class About(models.Model):
    part1 = models.TextField()
    part2 = models.TextField()
    picture = models.FileField(upload_to='portfolio_files/', null=True)
    action = models.CharField(max_length=255)


class FooterSocial(models.Model):
    link = models.URLField()
    class_grp = models.CharField(max_length=255)


class FooterAddress(models.Model):
    line1 = models.CharField(max_length=255)
    line2 = models.CharField(max_length=255)



class ProfileHeader(models.Model):
    name = models.CharField(max_length=255)
    specialization =  models.CharField(max_length=255)
    picture = models.ImageField(upload_to='portfolio_images/')