from django.contrib import admin
from . import models
from django.utils.html import format_html



class ContactAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'subject', 'message', 'received_at')
    search_fields = ( 'name', 'email', 'subject', 'message' )


class LeadAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'registered_on')
    search_fields = ( 'email', 'registered_on' )



@admin.register(models.CrytoNew)
class CrptoNewsAdmin(admin.ModelAdmin):
    list_display = ('id', 'guid', 'imageurl', 'title', 'description', 'url', 'published_on')
    search_fields = ('source', 'title','published_on')


admin.site.register(models.Contact, ContactAdmin)
admin.site.register(models.Lead, LeadAdmin)