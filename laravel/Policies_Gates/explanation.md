# Policies and Gates

Policies encapsulate authorization logic for a model. Gates are simple, global checks.

Policy example:

```bash
php artisan make:policy PostPolicy --model=Post
```

```php
namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
}
```

Use in controller:

```php
public function update(Request $request, Post $post)
{
    $this->authorize('update', $post);
    // update logic
}
```

Gate example:

```php
Gate::define('view-admin', fn (User $user) => $user->is_admin);

if (Gate::allows('view-admin')) {
    // allowed
}
```
