# Views and Blade Templating

Blade is Laravel's templating engine. It adds control structures and layouts on top of plain PHP.

Layout example:

```php
// resources/views/layouts/app.blade.php
<!doctype html>
<html>
<head>
    <title>@yield('title')</title>
</head>
<body>
    @yield('content')
</body>
</html>
```

Child view:

```php
// resources/views/posts/index.blade.php
@extends('layouts.app')

@section('title', 'Posts')

@section('content')
    <ul>
        @foreach ($posts as $post)
            <li>{{ $post->title }}</li>
        @endforeach
    </ul>
@endsection
```

Blade features:
- `@if`, `@foreach`, `@isset` directives for control flow.
- `{{ }}` HTML-escaped output.
- `@include` partials.
- Components for reusable UI.
