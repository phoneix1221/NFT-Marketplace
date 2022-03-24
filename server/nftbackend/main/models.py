from django.db import models
from django.contrib.auth.models import User
import math
import random

import random

class Profile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name='profile')
    image=models.ImageField(default='default.png',upload_to='profile_pics')
    phone_number=models.CharField( blank=True, null=True, default=None, unique=True,max_length=12)
    public_address=models.CharField( blank=False, null=False, unique=True,max_length=50)
    wallet=models.IntegerField(default=0)
    nonse=models.TextField( blank=False, null=False,default=str(random.uniform(0,10000) * 1000000))


    def __str__(self):
        return f'{self.user.username} Profile'
    