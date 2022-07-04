from django.contrib import admin
from blog.models import post
from blog.models import Category,CrytoNew

# Register your models here.
admin.site.register(post)
admin.site.register(Category)


@admin.register(CrytoNew)
class CrptoNewsAdmin(admin.ModelAdmin):
    list_display = ('id', 'guid', 'imageurl', 'title', 'description', 'url', 'published_on')
    search_fields = ('source', 'title','published_on')
