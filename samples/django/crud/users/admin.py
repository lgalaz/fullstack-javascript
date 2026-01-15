from django.contrib import admin
from .models import AppUser, Post


@admin.register(AppUser)
class AppUserAdmin(admin.ModelAdmin):
    list_display = ("id", "display_name", "user", "age", "city")
    search_fields = ("display_name", "user__username", "user__email")


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "created_at")
    list_filter = ("author",)
    search_fields = ("title", "body", "author__name")
