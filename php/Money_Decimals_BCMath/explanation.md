# Money, Decimals, and BCMath

## Avoid Floating Point for Money

Floats cannot represent decimal fractions exactly. Store money as integers (cents) or use decimal math.
PHP floats use IEEE 754 binary fractions (base-2), where values are stored as a sign, exponent, and mantissa. The mantissa (also called the significand) is the part of a floating‑point number that stores the significant digits.
Many decimal fractions (like 0.1 or 19.99) have repeating representations in base-2 (for example, 0.1 is 0.0001100110011...),
so they get rounded to the nearest representable binary value, which introduces small errors.

```php
<?php

declare(strict_types=1);

echo sprintf('%.17f', 0.1 + 0.2); // 0.30000000000000004
```

```php
<?php

declare(strict_types=1);

$priceCents = 1999;
$taxCents = 200;
$totalCents = $priceCents + $taxCents;
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
