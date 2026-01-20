# Namespaces, Imports, and Includes

## Namespaces

Namespaces prevent name collisions by grouping code under a prefix.

```php
<?php

declare(strict_types=1);

namespace App\Domain\User;

final class UserId {}
```

## Imports (use)

`use` creates local aliases for fully qualified names. You can import classes, functions, and constants.

```php
<?php

declare(strict_types=1);

namespace App\Http;

use App\Domain\User\UserId;
use function App\Utils\slugify;
use const App\Utils\DEFAULT_PAGE_SIZE;

final class UserController {
    public function show(UserId $id): void {
        $slug = slugify('User Profile');
        $size = DEFAULT_PAGE_SIZE;
    }
}
```

You can alias to avoid collisions:

```php
use App\Domain\User\User as DomainUser;
use App\ReadModel\User as ReadUser;
```

## Fully Qualified Names

Prefix with `\` to bypass the current namespace.
“Bypass” means “don’t try to resolve in the current namespace.”
Without the leading \, PHP first looks in the current namespace (and any use aliases). With \DateTimeZone, you force the global namespace explicitly. So yes—it’s just saying “use the global class,” but the point is skipping the namespace lookup.

```php
$utc = new \DateTimeZone('UTC');
```

## include vs require

- `require`/`require_once`: fatal error if the file is missing.
- `include`/`include_once`: warning and the script continues.

Prefer Composer autoloading for classes. Use `require` for bootstrapping files that must exist.

```php
<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/bootstrap.php';
```

Example: Composer autoloading for classes (no manual includes needed):

```php
<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

$user = new App\Domain\User\UserId();
```

Example: require a bootstrap file that must exist:

```php
<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php'; // loads env, config, and error handlers
```

## include_path (Legacy)

`include_path` lets PHP search for files, but it makes resolution implicit and harder to reason about.
Avoid it in modern code; use explicit paths and Composer autoloading instead.
