from django.shortcuts import render


class BlockBadUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated and request.user.username == "bad":
            return render(request, "404.html", status=404)
        return self.get_response(request)
