from django.forms import ModelForm
from .models import *


class ContactForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Enter Name'})
        self.fields['email'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Enter Email'})
        self.fields['phone'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Enter Phone'})
        self.fields['message'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Enter Note'})

    class Meta:
        model = Contact
        fields = '__all__'



class VolunteerForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Enter Name'})
        self.fields['email'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Enter Email'})
        self.fields['picture'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Upload Image'})
        self.fields['occupation'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Enter Occupation'})
        self.fields['description'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Tell us about yourself'})


    class Meta:
        model = Volunteer
        fields = '__all__'