# Transactions, Isolation, and Locking

## Transactions

Transactions ensure all-or-nothing changes.

```php
<?php

declare(strict_types=1);

$pdo->beginTransaction();

try {
    $pdo->prepare('UPDATE accounts SET balance = balance - :amt WHERE id = :id')
        ->execute(['amt' => 1000, 'id' => 1]);
    $pdo->prepare('UPDATE accounts SET balance = balance + :amt WHERE id = :id')
        ->execute(['amt' => 1000, 'id' => 2]);

    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    throw $e;
}
```

## Isolation Levels

Isolation controls what concurrent transactions can see:

- `READ COMMITTED`: avoids dirty reads.
Transaction A reads data that Transaction B has written but not yet committed. If B later rolls back, A read data that never actually existed.
- `REPEATABLE READ`: avoids non-repeatable reads.
Transaction A reads the same row twice and gets different results because Transaction B committed an update between the two reads.
- `SERIALIZABLE`: strongest isolation, highest contention.

Use the weakest level that still satisfies correctness.
Enterprise apps usually use targeted locking/transactions (e.g., SELECT ... FOR UPDATE) and careful business logic under REPEATABLE READ or READ COMMITTED, reserving SERIALIZABLE for the few truly critical operations that require it.

# Core DBMS guarantees are usually ACID:

- Atomicity: all‑or‑nothing writes in a transaction
- Consistency: constraints/invariants are preserved
- Isolation: concurrent transactions don’t interfere (per isolation level)
- Durability: committed data survives crashes

## Locking

```sql
SELECT balance FROM accounts WHERE id = :id FOR UPDATE
```

The lock ensures a consistent read and prevents concurrent updates from interleaving.

## Savepoints (Partial Rollback)

Savepoints let you roll back part of a transaction without aborting the whole thing (if the database driver supports it).

```php
<?php

declare(strict_types=1);

$pdo->beginTransaction();

try {
    $pdo->exec('SAVEPOINT step1');
    $pdo->exec('UPDATE accounts SET balance = balance - 100 WHERE id = 1');

    // Something goes wrong, rollback only this part.
    $pdo->exec('ROLLBACK TO SAVEPOINT step1');

    $pdo->exec('UPDATE accounts SET balance = balance - 50 WHERE id = 1');
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    throw $e;
}
```

## Idempotency for External Calls

When a request can be retried, store an idempotency key and enforce uniqueness.
This prevents duplicate charges or state transitions.

```php
<?php

declare(strict_types=1);

// Client sends an Idempotency-Key header (e.g., UUID) and reuses it on retries.
$idempotencyKey = $_SERVER['HTTP_IDEMPOTENCY_KEY'] ?? '';
$customerId = 42;
$amount = 1000;
$requestHash = hash('sha256', $customerId . ':' . $amount);

if ($idempotencyKey === '') {
    http_response_code(400);
    exit('Missing idempotency key');
}

try {
    $pdo->beginTransaction();

    // idempotency_keys has UNIQUE(customer_id, key).
    $stmt = $pdo->prepare(
        'INSERT INTO idempotency_keys (customer_id, key, request_hash)
         VALUES (:customer_id, :key, :request_hash)'
    );
    $stmt->execute([
        'customer_id' => $customerId,
        'key' => $idempotencyKey,
        'request_hash' => $requestHash,
    ]);

    // Only runs on the first attempt.
    $pdo->prepare('INSERT INTO charges (customer_id, amount_cents) VALUES (:customer_id, :amount)')
        ->execute(['customer_id' => $customerId, 'amount' => $amount]);
    $chargeId = (int) $pdo->lastInsertId();

    $pdo->prepare('UPDATE idempotency_keys SET charge_id = :charge_id WHERE customer_id = :customer_id AND key = :key')
        ->execute(['charge_id' => $chargeId, 'customer_id' => $customerId, 'key' => $idempotencyKey]);

    $pdo->commit();
    echo 'Charge created: ' . $chargeId;
} catch (PDOException $e) {
    $pdo->rollBack();
    if ($e->getCode() === '23000') {
        // Duplicate key: return the original result.
        $row = $pdo->prepare(
            'SELECT request_hash, charge_id FROM idempotency_keys
             WHERE customer_id = :customer_id AND key = :key'
        );
        $row->execute(['customer_id' => $customerId, 'key' => $idempotencyKey]);
        $stored = $row->fetch(PDO::FETCH_ASSOC) ?: [];

        if (($stored['request_hash'] ?? '') !== $requestHash) {
            http_response_code(409);
            exit('Idempotency key reused with different payload');
        }

        http_response_code(200);
        echo 'Charge already created: ' . ($stored['charge_id'] ?? 'unknown');
        exit;
    }
    throw $e;
}
```
