# API Resources and Serialization

API Resources transform models into JSON responses with a consistent shape.

Create a resource:

```bash
php artisan make:resource PostResource
```

Resource class:

```php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'author' => [
                'id' => $this->author->id,
                'name' => $this->author->name,
            ],
        ];
    }
}
```

Usage:

```php
use App\Http\Resources\PostResource;
use App\Models\Post;

return PostResource::collection(Post::with('author')->paginate());
```

Example: controller usage (request -> implementation -> response).

```php
namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with('author')->paginate(20);

        return PostResource::collection($posts);
    }

    public function show(Post $post)
    {
        return new PostResource($post->load('author'));
    }
}
```
