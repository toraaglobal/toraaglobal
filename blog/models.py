from django.db import models
from django.utils.text import slugify
from django.urls import reverse
from accounts.models import User
# from tinymce import models as tinymce_models
# from accounts.models import Profile
from tinymce.models import HTMLField

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField( unique = True,blank=True)
    discription = models.TextField()

    def __str__(self):
        return self.name

    def save(self,*args,**kwargs):
        self.slug = slugify(self.name)
        super().save(*args,**kwargs)

class post(models.Model):
    statuses = [('D','Draft'),('P','Published')]
    title = models.CharField(max_length=70)
    slug = models.SlugField(unique=True, blank=True)
    content = HTMLField()
    status = models.CharField(max_length=1,choices=statuses)
    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name='posts')
    image = models.ImageField(upload_to= "blog/post",blank = True)
    date =  models.DateField()
    author = models.ForeignKey(User,on_delete= models.CASCADE)

    def __str__(self):
        return self.title

    def save(self,*args,**kwargs):
        self.slug = slugify(self.title)
        super().save(*args,**kwargs)

    def get_absolute_url(self):
        return reverse('detail-page', kwargs={'slug':self.slug})

   



class CrytoNew(models.Model):
    id=models.BigIntegerField(unique=True, primary_key=True)
    guid = models.CharField(max_length=256)
    imageurl = models.CharField(max_length=256)
    title = models.CharField(max_length=256)
    description = models.TextField(max_length=2000)
    url = models.TextField(max_length=2000)
    published_on = models.DateTimeField()
    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name='cryptos')


    def __str__(self):
        return self.description

    class Meta:
        ordering = ['-published_on']

