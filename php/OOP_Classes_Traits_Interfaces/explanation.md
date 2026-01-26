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
- Use `final` for classes or methods you do not want extended, to keep invariants safe. Final classes cant be sublcassed at all. Final meethods can't be overridden.

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
Inheritance is when a class extends a base class to reuse and specialize its behavior.
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

$emailNotifier = new EmailNotifier();
$smsNotifier = new SmsNotifier();
alert($emailNotifier, 'notify email');
alert($smsNotifier, 'notify sms');
```

Another polymorphism example with a collection:

```php
<?php

declare(strict_types=1);

$notifiers = [new EmailNotifier(), new SmsNotifier()];

foreach ($notifiers as $notifier) {
    $notifier->send('System maintenance tonight');
}
```

## Covariance and Contravariance

These are type‑system rules, and languages vary in how (or whether) they enforce them.

In PHP specifically, covariance for return types and contravariance for parameter types are enforced when overriding methods (since PHP 7.4+).

Covariant: you can substitute a more specific type.
Contravariant: you can substitute a more general type.

Return types are usually covariant (subclass can return a subtype).
Parameter types are usually contravariant (subclass can accept a supertype).

Example idea: if a base method returns `Animal`, an override can return `Dog` (covariant). If a base method accepts `Dog`, an override can accept `Animal` (contravariant).

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

```php
<?php

trait A { public function log(): string { return 'A'; } }
trait B { public function log(): string { return 'B'; } }

final class Report {
    use A, B {
        A::log insteadof B;
        B::log as logFromB;
    }
}
```

Why use a trait instead of an abstract class:
- PHP only allows single inheritance, so a trait lets you mix in behavior without forcing a class hierarchy.
- Traits are best for small, orthogonal behaviors (independent features that do not depend on each other or on the class hierarchy); abstract classes are better when you need a shared base with required structure or template methods.
A template method is a pattern where a base class defines the algorithm’s overall steps, but lets subclasses fill in or override specific steps. The “template” is the fixed structure; the variable parts are deferred to subclasses (or protected hooks).

Template method example (base class defines the algorithm skeleton):

```php
<?php

declare(strict_types=1);

abstract class ReportGenerator {
    // Template method. Lives in the base class and defines the algorithm’s steps.
    final public function generate(): string { 
        $data = $this->fetchData();
        $rows = $this->formatRows($data);
        return $this->render($rows);
    }

    abstract protected function fetchData(): array;

    protected function formatRows(array $data): array {
        return $data;
    }

    protected function render(array $rows): string {
        return implode("\n", $rows);
    }
}

final class CsvReport extends ReportGenerator {
    // Subclass can override some of the steps with specific implementations
    protected function fetchData(): array { 
        return ['id,name', '1,Ada', '2,Grace'];
    }

    protected function formatRows(array $data): array {
        return $data;
    }
}
```

When to use a trait:
- Cross-cutting, stateless behavior (small helpers, shared implementation detail).
- Avoid traits for core domain behavior; prefer composition or interfaces to keep design explicit.

Example trait:

```php
<?php

declare(strict_types=1);

trait Timestamps {
    private DateTimeImmutable $createdAt;

    public function markCreated(): void {
        $this->createdAt = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    }

    public function createdAt(): DateTimeImmutable {
        return $this->createdAt;
    }
}

final class Post {
    use Timestamps;
}
```

Laravel example (Eloquent uses traits heavily):

```php
<?php

declare(strict_types=1);

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Post extends Model {
    use SoftDeletes;
}
```

Traits like `SoftDeletes`, `HasFactory`, and `Notifiable` let Laravel add optional behavior to many unrelated models without forcing them into a shared abstract base class.

## Composition, Aggregation, and Association

Association is a general relationship between objects (works with, knows about). It can be "uses-a" or "has-a" without ownership.
Aggregation is a weak "has-a" relationship where the part is not owned exclusively by the whole and can exist independently or be shared.
Composition is a strong "has-a" relationship where the whole owns the part's lifecycle and the part does not meaningfully exist without it.

Quick mental model:
- Inheritance is "is-a" (a Car is a Vehicle).
- Composition/Aggregation are "has-a" (a Car has an Engine).
- Association is "uses-a" (a Driver uses a Car).

Note: If the Driver stores a reference to the car reference (e.g., it’s a property) that’s aggregation (“has‑a”). 
If the Driver just uses a Car passed into a method, that’s association (“uses‑a”). The difference is about ownership/lifetime, not the real‑world wording.
Aggregation: Driver has a Car as a field; Car can exist without Driver.
Composition: Driver creates/controls the Car lifecycle; Car doesn’t meaningfully exist without Driver.
Association: Driver uses a Car temporarily (e.g., method parameter), no stored reference.

Prefer composition over inheritance to reduce coupling and make behavior easier to test and swap.

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
Note: Dependency injection encourages composition by having objects receive collaborators instead of inheriting behavior, which keeps relationships explicit and flexible.

## SOLID Principles (Senior Focus)

SOLID stands for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.

S: Single Responsibility (one reason to change, one axis of change). A class should have a single, focused purpose and only change when that purpose changes.

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

Why: core code stays stable while new behavior is added in new types, reducing regressions.
How: depend on abstractions and inject implementations so behavior can be extended without editing the core.

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
// Note: This example is essentially the Strategy pattern: a context (PriceCalculator) delegates pricing to interchangeable strategy objects (Pricing implementations).

interface Pricing {
    public function supports(string $type): bool;
    public function price(string $type): int;
}

final class PriceCalculator {
    /** @param Pricing[] $strategies */
    public function __construct(private array $strategies) {}

    public function priceFor(string $type): int {
        foreach ($this->strategies as $pricing) {
            if ($pricing->supports($type)) {
                return $pricing->price($type);
            }
        }
        throw new InvalidArgumentException("Unknown type: {$type}");
    }
}

final class StandardPricing implements Pricing {
    public function supports(string $type): bool { return $type === 'standard'; }
    public function price(string $type): int { return 10; }
}

$calculator = new PriceCalculator([
    new StandardPricing(),
]);

echo $calculator->priceFor('standard');

// Add PremiumPricing by creating a new class and registering it in the strategies list.
```

L: Liskov Substitution (subtypes must be usable as their base type)
Subclasses should honor the parent’s contract—same or weaker preconditions, same or stronger postconditions, and preserved invariants.

- Preconditions are what must be true before a method is called.
LSP says a subclass must not require more than the base class (so it can accept everything the base could). That’s “same or weaker preconditions.”

- Postconditions are what must be true after the method finishes.
LSP says a subclass must guarantee at least what the base promised (and can promise more). That’s “same or stronger postconditions.”

Conditions example:
If a subclass method requires more than the base, then code that works with the base can break when given the subclass. That violates substitutability. Example: base accepts any positive amount, subclass only accepts amounts over 100, codethatpasses50 would work for the base but fail for the subclass.
If a subclass weakens postconditions, callers relying on the base contract can break.
Example: base save() guarantees the data is persisted. If a subclass’s save() sometimes does nothing (or silently drops data), any code that assumes “after save, data is stored” is now wrong. That violates LSP because the subclass no longer fulfills the base’s promise.


Liskov Bad example:
Liskov is about behavioral contracts, not just return types.
save(): void still matches the signature, but the subclass changes the behavior by refusing to save (throws). That breaks callers who rely on “save works.”

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
Liskov good example:
```php
<?php

interface ReadableStore { public function read(): string; }
interface WritableStore { public function save(string $data): void; }
// Separate interfaces avoid forcing a read-only store to support save().
```

I: Interface Segregation (small, specific interfaces). Clients should not be forced to depend on methods they do not use; prefer several focused interfaces over one wide one.

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
interface Manager { public function manage(): void; }
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

final class StripeClient implements PaymentGateway {
    public function charge(int $cents): void {
        // talk to Stripe
    }
}

final class Checkout {
    // Depends on an abstraction so implementations can vary.
    public function __construct(private PaymentGateway $gateway) {}
}

$checkout = new Checkout(new StripeClient());
```

## Design Patterns (GoF)

GoF means Gang of Four. Common patterns in PHP codebases include Factory (create objects), Strategy (swap behavior), Observer (events), Adapter (compatibility), and Decorator (wrap behavior). Frameworks use these heavily, so recognizing them makes code easier to reason about.

Factory: centralizes object creation.
Because creation often has rules: selecting a subclass, validating inputs, wiring dependencies, or applying defaults. A factory keeps those rules in one place 
```php
<?php

final class ConnectionFactory {
    public static function make(string $driver): PDO {
        return new PDO($driver);
    }
}

$pdo = ConnectionFactory::make('sqlite::memory:');
```

Strategy: swap behavior via a shared interface.
```php
<?php

interface TaxStrategy { public function rate(): float; }
final class UkTax implements TaxStrategy { public function rate(): float { return 0.2; } }
final class UsTax implements TaxStrategy { public function rate(): float { return 0.07; } }

$strategy = new UkTax();
$total = 100 * (1 + $strategy->rate());
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

$bus = new EventBus();
$bus->on('user.registered', fn (array $user) => print $user['email']);
$bus->emit('user.registered', ['email' => 'ada@example.com']); // prints: ada@example.com
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

$logger = new LoggerAdapter(new LegacyLogger());
$logger->log('started');
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

$notifier = new LoggingNotifier(new EmailNotifier());
$notifier->send('hello'); // sends the email and also logs
```
