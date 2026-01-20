# Storage and Files

Laravel's filesystem abstraction supports local, S3, and other disks via Flysystem.

Configure disks in `config/filesystems.php` and `.env`.

Store a file:

```php
use Illuminate\Support\Facades\Storage;

Storage::disk('s3')->put('reports/report.pdf', $contents);
```

Generate a URL:

```php
$url = Storage::disk('s3')->url('reports/report.pdf');
```

Handle uploads:

```php
public function store(Request $request)
{
    $path = $request->file('avatar')->store('avatars', 'public');
}
```
