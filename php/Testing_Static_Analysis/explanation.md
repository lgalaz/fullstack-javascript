# Testing, Static Analysis, and Code Quality

## Testing

Unit tests verify business rules. Integration tests validate boundaries (DB, queues, APIs).

```php
<?php

declare(strict_types=1);

final class MoneyTest extends PHPUnit\Framework\TestCase {
    public function testAdd(): void {
        $a = new Money(100, 'USD');
        $b = new Money(200, 'USD');
        $this->assertSame(300, $a->add($b)->cents());
    }
}
```

## Static Analysis

Use PHPStan or Psalm to catch type errors and dead code early.
Aim for high strictness in core domain code.

## Code Style

PSR-12 is the common style guide. Automate with PHP-CS-Fixer or Pint.

## Mutation Testing

Mutation testing (e.g., Infection) verifies tests actually detect logic changes.

Example Infection config:

```json
{
    "source": {
        "directories": ["src"]
    },
    "timeout": 10,
    "logs": {
        "text": "infection.log"
    },
    "phpUnit": {
        "configDir": ".",
        "customPath": "vendor/bin/phpunit"
    },
    "mutators": {
        "@default": true
    }
}
```

Save as `infection.json` at the project root.
It runs your existing PHPUnit suite; no extra tests are required, but weak tests will show up as surviving mutants.
Entry point is the CLI: `vendor/bin/infection` (add `--threads` or `--min-msi` as needed).
--min-msi sets the minimum Mutation Score Indicator (percentage of killed mutants). If the score is below that threshold, Infection exits with a failure code (useful for CI).

Example of a weak test that would let an unacceptable mutant survive:

```php
function isAdult(int $age): bool {
    return $age >= 18;
}

// Bad test: only checks the "true" path
// A mutant that changes >= 18 to > 18 would still pass, because the test never checks the boundary or false cases. A good test would include 18 and 17 to kill that mutant.

public function test_is_adult_returns_true(): void {
    $this->assertTrue(isAdult(20));
}

// Good test: many test cases, considers the boundry
/**
 * @dataProvider agesProvider
 */
public function test_is_adult(int $age, bool $expected): void {
    $this->assertSame($expected, isAdult($age));
}

public function agesProvider(): array {
    return [
        [17, false],
        [18, true],
        [20, true],
    ];
}
```


Dependency audit example:

```sh
composer audit
```

This exits non-zero when advisories are found, so CI can fail the job.

## A common CI set for PHP:

- On Push/PR
  - phpunit for tests
  - integration tests. Most frameworks have utilities for simplifying these tests (like API tests)
  - end to end tests for critical paths (Playwright/Cypress)
  - accesibility testing (AXE) (Playwright/Cypress)
  - phpstan or psalm for static analysis
  - php-cs-fixer (or Pint) for style/lint
  - composer audit (or symfony security:check) for dependency vulnerabilities
  - Static Application Security Testing via Semgrep CLI (Critical HighSeverity ruleset)
- nightly
  - infection for mutation testing (often on nightly or main branch)
  - load/perf testing (e.g., k6 or Artillery) against staging
  - Static Application Security Testing via Semgrep CLI (Broad ruleset)
  - Dynamic Application Security Testing via OWASP ZAP, run against staging.

