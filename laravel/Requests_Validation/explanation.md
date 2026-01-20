# Requests and Validation

Laravel provides a rich `Request` object and validation helpers.

Inline validation:

```php
public function store(Request $request)
{
    $data = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required', 'min:8'],
    ]);

    // $data contains only validated fields
}
```

Form request classes:

```bash
php artisan make:request StoreUserRequest
```

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8'],
        ];
    }

    public function authorize(): bool
    {
        return true; // or Gate/Policy check
    }
}
```

Usage:

```php
public function store(StoreUserRequest $request)
{
    $data = $request->validated();
}
```

Validation errors are flashed to the session for web routes and returned as JSON for API routes.
