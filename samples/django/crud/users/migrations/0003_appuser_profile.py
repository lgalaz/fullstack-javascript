from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_post"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name="appuser",
            name="name",
        ),
        migrations.RemoveField(
            model_name="appuser",
            name="password",
        ),
        migrations.AddField(
            model_name="appuser",
            name="user",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="profile",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="appuser",
            name="display_name",
            field=models.CharField(default="", max_length=120, unique=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="appuser",
            name="age",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="appuser",
            name="city",
            field=models.CharField(blank=True, max_length=120),
        ),
    ]
