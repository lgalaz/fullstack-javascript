# Money, Decimals, and BCMath

## Avoid Floating Point for Money

Floats cannot represent decimal fractions exactly. Store money as integers (cents) or use decimal math (using a decimal‑safe representation instead of binary floats, like BCMath, ext-decimal, money libraries).

PHP floats use IEEE 754 binary fractions (base-2).
Floats are stored in binary, so many decimal fractions become repeating in base‑2 (for example, 0.1 is 0.0001100110011...),
They must be rounded to the nearest representable binary value, which introduces small errors that can accumulate across operations.

```php
<?php

declare(strict_types=1);

echo sprintf('%.17f', 0.1 + 0.2); // 0.30000000000000004
```

## BCMath (Binary Calculator Math) for Decimal Precision

BCMath provides arbitrary precision decimal operations.

```php
<?php

declare(strict_types=1);

$amount = '19.99';
$fee = '0.30';
$total = bcadd($amount, $fee, 2); // "20.29"
```

## Money Value Object Pattern

Encapsulate currency and rounding in a value object to keep rules consistent.
Because money rules (currency, rounding, precision) must be applied consistently everywhere. A value object centralizes that logic so you can’t accidentally mix currencies, round differently in different places, or do unsafe arithmetic. It makes money behavior explicit, testable, and reusable.

```php
<?php

declare(strict_types=1);

final class Money {
    public function __construct(
        private int $cents,
        private string $currency
    ) {}

    public function add(Money $other): Money {
        if ($this->currency !== $other->currency) {
            throw new InvalidArgumentException('Currency mismatch');
        }
        return new Money($this->cents + $other->cents, $this->currency);
    }

    public function cents(): int {
        return $this->cents;
    }
}
```
