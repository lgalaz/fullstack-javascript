from django.db import models


class AppUser(models.Model):
    name = models.CharField(max_length=120, unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.name
