from django.conf import settings
from django.db import models


class AppUser(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        null=True,
        blank=True,
    )
    display_name = models.CharField(max_length=120, unique=True)
    age = models.PositiveSmallIntegerField(null=True, blank=True)
    city = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return self.display_name


class Post(models.Model):
    author = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=200)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        author_name = self.author.display_name if self.author else "unknown"
        return f"{self.title} ({author_name})"
