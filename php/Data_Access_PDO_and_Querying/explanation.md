# Data Access with PDO

## PDO

PDO stands for PHP Data Objects. It is a consistent API for working with databases.

## Prepared Statements

A prepared statement separates SQL from data to prevent SQL injection, which is an attack that injects malicious SQL into a query.
Note: set `PDO::ATTR_EMULATE_PREPARES` to `false` when possible to use real prepared statements for better type handling and security.
With emulation off, PDO sends the SQL with placeholders to the database, and then sends the bound values separately; the database prepares and executes the statement. With emulation on, PDO interpolates the values into the SQL string itself and sends a single full query.

DSN means Data Source Name, a connection string that tells PDO how to connect.

```php
<?php

declare(strict_types=1);

$dsn = 'mysql:host=localhost;dbname=app;charset=utf8mb4';
$username = 'app';
$password = 'secret';

$pdo = new PDO($dsn, $username, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

$stmt = $pdo->prepare('SELECT id, email FROM users WHERE id = :id');
$stmt->execute(['id' => 1]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

print_r($user);

## Transactions and Integrity

See `php/Transactions_Isolation_Locking/explanation.md` for details.
```
