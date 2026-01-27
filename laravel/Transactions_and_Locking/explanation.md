# Transactions and Locking

Laravel wraps database transactions via the `DB` facade. Use them to keep related writes atomic.

```php
use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    DB::table('accounts')->where('id', 1)->decrement('balance', 100);
    DB::table('accounts')->where('id', 2)->increment('balance', 100);
});
```

## Savepoints (Nested Transactions)

Laravel supports nested transactions. When the database supports savepoints, Laravel uses them under the hood so an inner failure can roll back without aborting the outer transaction.

```php
DB::beginTransaction();

try {
    DB::table('accounts')->where('id', 1)->decrement('balance', 100);

    DB::transaction(function () {
        DB::table('audit_logs')->insert(['event' => 'debit']);
        // throw new RuntimeException('fail');
    });

    DB::commit();
} catch (Throwable $e) {
    DB::rollBack();
    throw $e;
}
```

## Locking Rows

Use row-level locks when you need consistent reads under concurrency.

```php
DB::transaction(function () {
    $account = DB::table('accounts')
        ->where('id', 1)
        ->lockForUpdate()
        ->first();

    DB::table('accounts')
        ->where('id', 1)
        ->update(['balance' => $account->balance - 100]);
});
```

This issues `SELECT ... FOR UPDATE` in supported databases.

Eloquent with row locking:

```php
use Illuminate\Support\Facades\DB;
use App\Models\Account;

DB::transaction(function () {
    $account = Account::whereKey(1)
        ->lockForUpdate()
        ->firstOrFail();

    $account->decrement('balance', 100);
});
```
