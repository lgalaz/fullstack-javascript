# Enums and Match

## Enums

An enum (short for enumeration) defines a fixed set of values.
PHP 8.1 supports backed enums, where each case has a scalar value (a single primitive like int or string).
Backed enum cases have a name and a scalar value; non-backed enum cases only have a name.

Note: enums are safer than strings for domain values because they prevent invalid states at runtime.

```php
<?php

declare(strict_types=1);

enum Status: string {
    case Draft = 'draft';
    case Published = 'published';
}

function canEdit(Status $status): bool {
    return $status === Status::Draft;
}

echo Status::Published->value; // 'published'
$status = Status::Published;
echo canEdit($status); // false
```

Non-backed enum example:

```php
<?php

declare(strict_types=1);

enum Role {
    case Admin;
    case Editor;
    case Viewer;
}

$role = Role::Admin;
echo $role->name; // 'Admin'
```

## Match Expressions

A match expression is like a switch but is exhaustive and returns a value.
Exhaustive means all possible inputs must be handled.
If no case matches and there is no `default`, PHP throws an `UnhandledMatchError`.
Unlike `switch`, `match` uses strict comparison (`===`) and never falls through to the next case.
Each arm is a single expression, and multiple conditions can be grouped in one arm (for example, `1, 2 => 'low'`).

```php
<?php

declare(strict_types=1);

enum Status: string {
    case Draft = 'draft';
    case Published = 'published';
}

function labelForStatus(Status $status): string {
    return match ($status) {
        Status::Draft => 'Draft',
        Status::Published => 'Published',
    };
}

echo labelForStatus(Status::Draft); // Draft

$handler = match ($type) {
    'email' => fn() => sendEmail(),
    'sms' => fn() => sendSms(),
    default => fn() => logUnknown(),
};

$handler(); // invoke the selected callable
```
