# Models and Eloquent ORM

Eloquent is Laravel's ORM. Models map to database tables and provide query APIs.

Example model:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = ['title', 'body'];

    public function author()
    {
        return $this->belongsTo(User::class);
    }
}
```

Querying:

```php
$posts = Post::where('published', true)
    ->latest()
    ->take(10)
    ->get();
```

Relationships:

```php
$post = Post::with('author')->first();
echo $post->author->name;
```

Mass assignment:
- Use `$fillable` to allow safe mass assignment.
- Use `$guarded` to block sensitive fields.

Best practice is whitelist with $fillable. It’s safer because new fields aren’t accidentally mass‑assignable

## Polymorphic Many-to-Many

Polymorphic relations let one table link to multiple models via `*_id` and `*_type`. This is useful for shared metadata like tags or idempotency keys.

Example: attach idempotency keys to multiple entity types using a single table.

```php
// migration columns: idempotency_keys: id, key, request_hash, model_id, model_type
class IdempotencyKey extends Model
{
    protected $fillable = ['key', 'request_hash'];

    public function models()
    {
        return $this->morphedByMany(Model::class, 'model');
    }
}

class Charge extends Model
{
    public function idempotencyKeys()
    {
        return $this->morphToMany(IdempotencyKey::class, 'model');
    }
}

class Refund extends Model
{
    public function idempotencyKeys()
    {
        return $this->morphToMany(IdempotencyKey::class, 'model');
    }
}
```
