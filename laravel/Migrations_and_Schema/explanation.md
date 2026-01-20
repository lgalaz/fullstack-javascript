# Migrations and Schema

Migrations are version-controlled database changes. The Schema builder defines tables.

Create a migration:

```bash
php artisan make:migration create_posts_table
```

Example migration:

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body');
            $table->boolean('published')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

Run migrations:

```bash
php artisan migrate
php artisan migrate:rollback (last batch)
php artisan migrate:reset (all migrations down)
php artisan migrate:refresh (rollback + rerun all)
php artisan migrate:fresh (drop all tables + rerun)
```
