from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import *

from django.contrib.auth.models import User, Group
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']

    


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']



class ProfileSerializer(serializers.ModelSerializer):
    # user= UserSerializer(read_only=True)
    class Meta:
        model=Profile
        fields = ('user',"phone_number","public_address","nonse")

    