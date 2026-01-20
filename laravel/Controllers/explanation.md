# Controllers

Controllers group related request handlers. Use them for HTTP-specific logic and delegate business logic to services.

Example controller:

```php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        return view('posts.index', [
            'posts' => Post::latest()->paginate(20),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'body' => ['required', 'string'],
        ]);

        $post = Post::create($data);

        return redirect()->route('posts.show', $post);
    }
}
```

Resource controllers map CRUD actions:

```php
Route::resource('posts', PostController::class);
```

This creates `index`, `create`, `store`, `show`, `edit`, `update`, `destroy` routes.
