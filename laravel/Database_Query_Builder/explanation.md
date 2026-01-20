# Database Query Builder

Laravel's query builder provides a fluent SQL interface without models.

Example:

```php
$users = DB::table('users')
    ->select('id', 'name')
    ->where('active', true)
    ->orderBy('created_at', 'desc')
    ->get();
```

Joins:

```php
$rows = DB::table('orders')
    ->join('users', 'orders.user_id', '=', 'users.id')
    ->select('orders.id', 'users.email')
    ->get();
```

Transactions:

```php
DB::transaction(function () use ($data) {
    DB::table('accounts')->where('id', 1)->decrement('balance', 100);
    DB::table('accounts')->where('id', 2)->increment('balance', 100);
});
```
