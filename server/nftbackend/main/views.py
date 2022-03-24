from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from .models import *
from .serializers import UserSerializer, GroupSerializer,ProfileSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import json


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class CustomUserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'public_address'

@csrf_exempt
def verify(request):
    if request.method=='POST':
            print("request is")
            js=json.loads(request.body)
            print(js)
            

            return HttpResponse(status=201)