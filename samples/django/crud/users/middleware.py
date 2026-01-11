from django.shortcuts import render


class BlockBadUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.session.get("username") == "bad":
            return render(request, "404.html", status=404)
        return self.get_response(request)
