from django.contrib import admin
from .models import *

# Register your models here.
class ContactAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone','message', 'received_at')
    search_fields = ( 'name', 'email', 'phone', 'message' )


class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'picture', 'portfolio', 'content', 'portfolio_link')
    search_fields = ('title', 'picture', 'portfolio', 'content')


class AboutAdmin(admin.ModelAdmin):
    list_display = ('id', 'part1', 'part2', 'action', 'picture')


class FooterSocialAdmin(admin.ModelAdmin):
    list_display = ('id','link', 'class_grp')


class FooterAddressdmin(admin.ModelAdmin):
    list_display = ('id','line1', 'line2')



class ProfileHeaderAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'specialization', 'picture')


admin.site.register(Contact, ContactAdmin)
admin.site.register(Portfolio, PortfolioAdmin)
admin.site.register(About, AboutAdmin)
admin.site.register(FooterSocial, FooterSocialAdmin)
admin.site.register(FooterAddress, FooterAddressdmin)
admin.site.register(ProfileHeader, ProfileHeaderAdmin)