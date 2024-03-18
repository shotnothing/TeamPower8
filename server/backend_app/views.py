from django.shortcuts import render
from django.http import HttpResponse

def test(request):
    user_ip = request.META.get('REMOTE_ADDR', '')
    user_agent = request.META.get('HTTP_USER_AGENT', '')

    # Bear witness to templating in raw string!
    response = f"Hello, world! Your IP address is {user_ip}. " \
               f"Your user agent is {user_agent}."

    return HttpResponse(response)
