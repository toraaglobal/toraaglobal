# Generated by Django 3.1.7 on 2022-05-18 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0004_auto_20220518_1827'),
    ]

    operations = [
        migrations.AlterField(
            model_name='portfolio',
            name='portfolio',
            field=models.ImageField(upload_to='portfolio_images/'),
        ),
    ]
