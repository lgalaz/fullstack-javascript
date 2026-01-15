from django.contrib.auth import authenticate, get_user_model, login as auth_login, logout as auth_logout
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from .models import AppUser, Post


def _require_login(request):
    if not request.user.is_authenticated:
        return redirect("login")
    return None


def _get_current_app_user(request):
    if not request.user.is_authenticated:
        return None
    default_name = request.user.username
    if AppUser.objects.filter(display_name=default_name).exclude(user=request.user).exists():
        default_name = f"{request.user.username}-{request.user.id}"
    app_user, _ = AppUser.objects.get_or_create(
        user=request.user,
        defaults={"display_name": default_name},
    )
    return app_user


def _is_admin(request):
    return bool(request.user.is_staff or request.user.is_superuser)


def home(request):
    if request.user.is_authenticated:
        return redirect("user_list")
    return redirect("login")


@require_http_methods(["GET", "POST"])
def login_view(request):
    error = ""
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")
        django_user = authenticate(request, username=username, password=password)
        if django_user:
            auth_login(request, django_user)
            return redirect("user_list")
        error = "Invalid credentials."
    return render(request, "login.html", {"error": error})


def logout_view(request):
    auth_logout(request)
    return redirect("login")


def user_list(request):
    login_redirect = _require_login(request)
    if login_redirect:
        return login_redirect
    users = AppUser.objects.select_related("user").order_by("display_name")
    return render(request, "users_list.html", {"users": users})


@require_http_methods(["GET", "POST"])
def user_create(request):
    login_redirect = _require_login(request)
    if login_redirect:
        return login_redirect
    error = ""
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")
        display_name = request.POST.get("display_name", "").strip()
        age = request.POST.get("age", "").strip()
        city = request.POST.get("city", "").strip()
        if not username or not password or not display_name:
            error = "Username, display name, and password are required."
        elif AppUser.objects.filter(display_name=display_name).exists():
            error = "Display name already exists."
        else:
            user_model = get_user_model()
            if user_model.objects.filter(username=username).exists():
                error = "Username already exists."
            else:
                auth_user = user_model.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                )
                AppUser.objects.create(
                    user=auth_user,
                    display_name=display_name,
                    age=int(age) if age else None,
                    city=city,
                )
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
        username = request.POST.get("username", "").strip()
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")
        display_name = request.POST.get("display_name", "").strip()
        age = request.POST.get("age", "").strip()
        city = request.POST.get("city", "").strip()
        if not username or not display_name:
            error = "Username and display name are required."
        elif AppUser.objects.filter(display_name=display_name).exclude(id=user_id).exists():
            error = "Display name already exists."
        else:
            auth_user = user.user
            if auth_user and auth_user.username != username:
                if get_user_model().objects.filter(username=username).exists():
                    error = "Username already exists."
                else:
                    auth_user.username = username
            if error:
                return render(
                    request,
                    "user_form.html",
                    {"mode": "edit", "user": user, "error": error},
                )
            if auth_user:
                auth_user.email = email
                if password:
                    auth_user.set_password(password)
                auth_user.save()
            user.display_name = display_name
            user.age = int(age) if age else None
            user.city = city
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
    if user.user:
        user.user.delete()
    else:
        user.delete()
    return redirect("user_list")


def post_list(request):
    login_redirect = _require_login(request)
    if login_redirect:
        return login_redirect
    if _is_admin(request):
        posts = Post.objects.select_related("author").order_by("-created_at")
    else:
        app_user = _get_current_app_user(request)
        if not app_user:
            return redirect("login")
        posts = (
            Post.objects.select_related("author")
            .filter(author=app_user)
            .order_by("-created_at")
        )
    return render(request, "posts_list.html", {"posts": posts})


@require_http_methods(["GET", "POST"])
def post_create(request):
    login_redirect = _require_login(request)
    if login_redirect:
        return login_redirect
    error = ""
    is_admin = _is_admin(request)
    app_user = None if is_admin else _get_current_app_user(request)
    users = AppUser.objects.all().order_by("display_name") if is_admin else []
    if request.method == "POST":
        title = request.POST.get("title", "").strip()
        body = request.POST.get("body", "").strip()
        author = app_user
        if is_admin:
            author_id = request.POST.get("author_id", "").strip()
            if author_id:
                author = AppUser.objects.filter(id=author_id).first()
        if not title or not body:
            error = "Title and body are required."
        elif not author:
            error = "Author is required."
        else:
            Post.objects.create(title=title, body=body, author=author)
            return redirect("post_list")
    return render(
        request,
        "post_form.html",
        {"mode": "create", "error": error, "users": users, "is_admin": is_admin},
    )


@require_http_methods(["GET", "POST"])
def post_edit(request, post_id):
    login_redirect = _require_login(request)
    if login_redirect:
        return login_redirect
    is_admin = _is_admin(request)
    app_user = None if is_admin else _get_current_app_user(request)
    if is_admin:
        post = get_object_or_404(Post, id=post_id)
    else:
        post = get_object_or_404(Post, id=post_id, author=app_user)
    error = ""
    users = AppUser.objects.all().order_by("display_name") if is_admin else []
    if request.method == "POST":
        title = request.POST.get("title", "").strip()
        body = request.POST.get("body", "").strip()
        author = post.author
        if is_admin:
            author_id = request.POST.get("author_id", "").strip()
            if author_id:
                author = AppUser.objects.filter(id=author_id).first()
        if not title or not body:
            error = "Title and body are required."
        elif not author:
            error = "Author is required."
        else:
            post.title = title
            post.body = body
            post.author = author
            post.save()
            return redirect("post_list")
    return render(
        request,
        "post_form.html",
        {
            "mode": "edit",
            "post": post,
            "error": error,
            "users": users,
            "is_admin": is_admin,
        },
    )


@require_http_methods(["POST"])
def post_delete(request, post_id):
    login_redirect = _require_login(request)
    if login_redirect:
        return login_redirect
    if _is_admin(request):
        post = get_object_or_404(Post, id=post_id)
    else:
        app_user = _get_current_app_user(request)
        post = get_object_or_404(Post, id=post_id, author=app_user)
    post.delete()
    return redirect("post_list")
