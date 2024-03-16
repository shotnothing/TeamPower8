from django.shortcuts import render
from django.http import HttpResponse

def test(request):
    return HttpResponse("Hello, world! This is a GET response.")

