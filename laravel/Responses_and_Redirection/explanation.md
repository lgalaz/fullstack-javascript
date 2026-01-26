# Responses and Redirection

Laravel provides helpers to build responses for HTML, JSON, files, and redirects.

JSON response:

```php
return response()->json(['ok' => true], 200);
```

File download:

```php
return response()->download(storage_path('reports/report.pdf'));
```

Redirects:

```php
return redirect()->route('posts.index');
```

Conditional responses with ETags and Last-Modified:
It’s a best practice because it reduces bandwidth and latency. Clients can revalidate cached responses and get 304 Not Modified instead of the full payload when nothing changed. That lowers server load, speeds up clients, and improves perceived performance.

```php
use Illuminate\Http\Request;

public function show(Request $request, Post $post)
{
    $response = response()->json($post);
    $response->setEtag($post->updated_at->timestamp);
    $response->setLastModified($post->updated_at);

    if ($response->isNotModified($request)) {
        return $response;
    }

    return $response;
}
```

Response macros let you add custom response helpers in a service provider.
