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

Response macros let you add custom response helpers in a service provider.
