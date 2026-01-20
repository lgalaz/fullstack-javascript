# Scaffolding

Laravel projects are typically created with Composer and then enhanced with Artisan scaffolding.

Create a new app:

```bash
composer create-project laravel/laravel myapp
```

Run the dev server:

```bash
php artisan serve
```

Common scaffolding options:
- **Auth scaffolding**: use packages like Laravel Breeze or Jetstream for login/registration UI.
- **API scaffolding**: use `php artisan make:controller` and API routes.
- **Migrations/models**: use `php artisan make:model Post -m` to create model + migration.

Example: generate a controller and resource:

```bash
php artisan make:controller PostController --resource
php artisan make:model Post -m
```

This creates:
- `app/Http/Controllers/PostController.php`
- `app/Models/Post.php`
- `database/migrations/*_create_posts_table.php`
