from django.contrib import admin
from .models import AppUser


@admin.register(AppUser)
class AppUserAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
