from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from .models import AppUser


def _require_login(request):
    if not request.session.get("username"):
        return redirect("login")
    return None


def home(request):
    if request.session.get("username"):
        return redirect("user_list")
    return redirect("login")


@require_http_methods(["GET", "POST"])
def login_view(request):
    error = ""
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")
        if username == "admin" and password == "django":
            request.session["username"] = username
            return redirect("user_list")
        error = "Invalid credentials. Try admin / django."
    return render(request, "login.html", {"error": error})


def logout_view(request):
    request.session.flush()
    return redirect("login")


def user_list(request):
    login_redirect = _require_login(request)
    if login_redirect:
        return login_redirect
    users = AppUser.objects.all().order_by("name")
    return render(request, "users_list.html", {"users": users})


@require_http_methods(["GET", "POST"])
def user_create(request):
    login_redirect = _require_login(request)
    if login_redirect:
        return login_redirect
    error = ""
    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        password = request.POST.get("password", "")
        if not name or not password:
            error = "Name and password are required."
        elif AppUser.objects.filter(name=name).exists():
            error = "Name already exists."
        else:
            AppUser.objects.create(name=name, password=password)
            return redirect("user_list")
    return render(request, "user_form.html", {"mode": "create", "error": error})


@require_http_methods(["GET", "POST"])
def user_edit(request, user_id):
    login_redirect = _require_login(request)
    if login_redirect:
        return login_redirect
    user = get_object_or_404(AppUser, id=user_id)
    error = ""
    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        password = request.POST.get("password", "")
        if not name or not password:
            error = "Name and password are required."
        elif AppUser.objects.filter(name=name).exclude(id=user_id).exists():
            error = "Name already exists."
        else:
            user.name = name
            user.password = password
            user.save()
            return redirect("user_list")
    return render(
        request,
        "user_form.html",
        {"mode": "edit", "user": user, "error": error},
    )


@require_http_methods(["POST"])
def user_delete(request, user_id):
    login_redirect = _require_login(request)
    if login_redirect:
        return login_redirect
    user = get_object_or_404(AppUser, id=user_id)
    user.delete()
    return redirect("user_list")
