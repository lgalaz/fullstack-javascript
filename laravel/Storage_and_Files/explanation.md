# Storage and Files

Laravel's filesystem abstraction supports local, S3, and other disks via Flysystem.

Configure disks in `config/filesystems.php` and `.env`.

Key points:
- `public` disk maps to `storage/app/public` and is typically symlinked to `public/storage` (`php artisan storage:link`).
- Use `storePublicly` or visibility options for public access; keep private files on non-public disks.
- Prefer streaming for large files (`putFileAs`, `readStream`) to avoid memory spikes.
- Signed URLs are supported for temporary access on S3-like drivers.

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

Store publicly:

```php
$path = $request->file('avatar')->storePublicly('avatars', 'public');
```

Streaming large files:

```php
use Illuminate\Support\Facades\Storage;

// Store with a custom name
Storage::disk('s3')->putFileAs('reports', $request->file('report'), 'report.pdf');

// Read as a stream
$stream = Storage::disk('s3')->readStream('reports/report.pdf');
```

Signed URL (temporary access):

```php
$url = Storage::disk('s3')->temporaryUrl(
    'reports/report.pdf',
    now()->addMinutes(10)
);
```
