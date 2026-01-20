# Factories and Seeders

Factories generate fake model data for tests or local seeding.

Factory example:

```php
namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'body' => $this->faker->paragraph(3),
            'published' => $this->faker->boolean(),
        ];
    }
}
```

Seeder example:

```php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Post::factory()->count(10)->create();
    }
}
```

Run seeders:

```bash
php artisan db:seed
```
