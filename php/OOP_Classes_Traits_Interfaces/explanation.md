# OOP: Classes, Traits, and Interfaces

OOP means Object-Oriented Programming.

## Classes and Objects

A class defines a blueprint. An object is an instance of that class.

```php
<?php

declare(strict_types=1);

class User {
    public function __construct(
        public int $id,
        public string $email,
    ) {}

    public function label(): string {
        return "{$this->email} (#{$this->id})";
    }
}

$user = new User(1, 'ada@example.com');

echo $user->label();
```

## Visibility

- `public`: accessible everywhere
- `protected`: accessible in the class and subclasses
- `private`: accessible only in the class itself

Senior guidance:
- Prefer the narrowest visibility that still works. Expose intent, not internals.
- Use `final` for classes or methods you do not want extended, to keep invariants safe.

## Readonly Properties

Readonly properties (PHP 8.1) can be written once, usually in the constructor.

```php
<?php

declare(strict_types=1);

final class Order {
    public function __construct(
        public readonly string $id,
    ) {}
}
```

## Abstraction, Inheritance, and Polymorphism

Abstraction means exposing a simplified interface while hiding implementation details.
Inheritance means a class extends another to reuse behavior.
Polymorphism means code can work with different implementations through a shared contract (interface or abstract class).
Generalization means designing a base type that captures common behavior for a family of types.

PHP does not support method overloading by signature (same method name with different parameter lists). Use optional parameters or variadics instead. PHP also does not support operator overloading.

An interface is a pure contract: it declares methods a class must implement but provides no method bodies or state. An abstract class can include shared implementation and state, and can leave some methods abstract for subclasses to define.

Example of polymorphism:

```php
<?php

declare(strict_types=1);

interface Notifier {
    public function send(string $message): void;
}

final class EmailNotifier implements Notifier {
    public function send(string $message): void {
        // send email
    }
}

final class SmsNotifier implements Notifier {
    public function send(string $message): void {
        // send SMS
    }
}

function alert(Notifier $notifier, string $message): void {
    $notifier->send($message);
}
```

## Abstract Modifier and Abstract Classes

`abstract` means a class or method cannot be instantiated directly and must be implemented by subclasses.

Use an abstract class when:
- You need shared base logic plus a required contract.
- You want to enforce some structure while providing defaults.

Prefer an interface when:
- You only need a contract.
- You want multiple implementations without shared state.

Example:

```php
<?php

declare(strict_types=1);

abstract class Logger {
    abstract public function log(string $message): void;

    protected function format(string $message): string {
        return '[' . date('c') . '] ' . $message;
    }
}

final class FileLogger extends Logger {
    public function log(string $message): void {
        file_put_contents('app.log', $this->format($message) . PHP_EOL, FILE_APPEND);
    }
}
```

## Interfaces

An interface defines a contract of methods a class must implement.

```php
<?php

declare(strict_types=1);

interface HasId {
    public function id(): int;
}

final class Account implements HasId {
    public function __construct(private int $id) {}

    public function id(): int {
        return $this->id;
    }
}
```

## Traits

A trait is a reusable set of methods and properties you can include in multiple classes.

Note: traits are copy-paste at compile time; method conflicts must be resolved explicitly, and heavy trait use can make behavior harder to trace.

When to use a trait:
- Cross-cutting, stateless behavior (small helpers, shared implementation detail).
- Avoid traits for core domain behavior; prefer composition or interfaces to keep design explicit.

## Composition, Aggregation, and Association

Association is a general relationship between objects (works with, knows about). It can be "uses-a" or "has-a" without ownership.
Aggregation is a weak "has-a" relationship where the part is not owned exclusively by the whole and can exist independently or be shared.
Composition is a strong "has-a" relationship where the whole owns the part's lifecycle and the part does not meaningfully exist without it.

Quick mental model:
- Inheritance is "is-a" (a Car is a Vehicle).
- Composition/Aggregation are "has-a" (a Car has an Engine).
- Association is "uses-a" (a Driver uses a Car).

Senior practice: prefer composition over inheritance to reduce coupling and make behavior easier to test and swap.

Example: composition is explicit and local.

```php
<?php

final class Formatter {
    public function format(string $message): string {
        return '[' . date('c') . '] ' . $message;
    }
}

final class FileLogger {
    public function __construct(private Formatter $formatter) {}

    public function log(string $message): void {
        file_put_contents('app.log', $this->formatter->format($message) . PHP_EOL, FILE_APPEND);
    }
}
```

Compared to inheritance, composition makes dependencies visible in the constructor and easy to swap:

```php
<?php

final class JsonFormatter extends Formatter {
    public function format(string $message): string {
        return json_encode(['message' => $message, 'time' => date('c')]);
    }
}

$logger = new FileLogger(new JsonFormatter());
```

## SOLID Principles (Senior Focus)

SOLID stands for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.

S: Single Responsibility (one reason to change)

Bad:
```php
<?php

final class ReportService {
    // Two reasons to change: report logic and email delivery.
    public function generate(): string { return 'report'; }
    public function sendEmail(string $to): void { /* sends email */ }
}
```
Good:
```php
<?php

final class ReportGenerator {
    public function generate(): string { return 'report'; }
}

final class EmailSender {
    // Separated responsibility: only email concerns live here.
    public function send(string $to, string $body): void { /* sends email */ }
}
```

O: Open/Closed (open for extension, closed for modification)

Bad:
```php
<?php

function priceFor(string $type): int {
    // Must modify this function for every new pricing type.
    if ($type === 'standard') return 10;
    if ($type === 'premium') return 20;
    return 0;
}
```
Good:
```php
<?php

interface Pricing {
    public function price(): int;
}

final class StandardPricing implements Pricing {
    // Add new pricing by implementing the interface, not editing priceFor.
    public function price(): int { return 10; }
}
```

L: Liskov Substitution (subtypes must be usable as their base type)

Bad:
```php
<?php

class FileStore {
    public function save(string $data): void { /* saves */ }
}

class ReadOnlyFileStore extends FileStore {
    // Violates base contract: save() no longer works.
    public function save(string $data): void { throw new RuntimeException('read-only'); }
}
```
Good:
```php
<?php

interface ReadableStore { public function read(): string; }
interface WritableStore { public function save(string $data): void; }
// Separate interfaces avoid forcing a read-only store to support save().
```

I: Interface Segregation (small, specific interfaces)

Bad:
```php
<?php

interface Worker {
    // Bloated interface forces clients to depend on methods they don't use.
    public function code(): void;
    public function design(): void;
    public function manage(): void;
}
```
Good:
```php
<?php

interface Coder { public function code(): void; }
interface Designer { public function design(): void; }
// Clients depend only on the capabilities they need.
```

D: Dependency Inversion (depend on abstractions, not concretions)

Bad:
```php
<?php

final class Checkout {
    private StripeClient $client;
    // Hard-coded dependency makes testing and swapping providers harder.
    public function __construct() { $this->client = new StripeClient(); }
}
```
Good:
```php
<?php

interface PaymentGateway { public function charge(int $cents): void; }

final class Checkout {
    // Depends on an abstraction so implementations can vary.
    public function __construct(private PaymentGateway $gateway) {}
}
```

## Design Patterns (GoF)

GoF means Gang of Four. Common patterns in PHP codebases include Factory (create objects), Strategy (swap behavior), Observer (events), Adapter (compatibility), and Decorator (wrap behavior). Frameworks use these heavily, so recognizing them makes code easier to reason about.

Factory: centralizes object creation.
```php
<?php

final class ConnectionFactory {
    public static function make(string $driver): PDO {
        return new PDO($driver);
    }
}
```

Strategy: swap behavior via a shared interface.
```php
<?php

interface TaxStrategy { public function rate(): float; }
final class UkTax implements TaxStrategy { public function rate(): float { return 0.2; } }
final class UsTax implements TaxStrategy { public function rate(): float { return 0.07; } }
```

Observer: notify subscribers when events occur.
```php
<?php

final class EventBus {
    private array $listeners = [];
    public function on(string $event, callable $listener): void { $this->listeners[$event][] = $listener; }
    public function emit(string $event, mixed $payload): void {
        foreach ($this->listeners[$event] ?? [] as $listener) {
            $listener($payload);
        }
    }
}
```

Adapter: wrap incompatible APIs to match your interface.
```php
<?php

interface Logger { public function log(string $message): void; }
final class LegacyLogger { public function write(string $message): void {} }
final class LoggerAdapter implements Logger {
    public function __construct(private LegacyLogger $legacy) {}
    public function log(string $message): void { $this->legacy->write($message); }
}
```

Decorator: wrap objects to add behavior without changing them.
```php
<?php

interface Notifier { public function send(string $message): void; }
final class EmailNotifier implements Notifier { public function send(string $message): void {} }
final class LoggingNotifier implements Notifier {
    public function __construct(private Notifier $inner) {}
    public function send(string $message): void {
        // log here
        $this->inner->send($message);
    }
}
```
