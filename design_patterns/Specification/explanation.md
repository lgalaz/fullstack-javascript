# Specification

## Overview

Encapsulates business rules as reusable, composable specifications.

## When to use

- You need to express complex filtering rules cleanly.
- Business rules must be reused across queries and validation.
- Rules should be combined (AND/OR/NOT) without duplication.

## Trade-offs

- Adds extra classes and indirection.
- Can be overkill for simple predicates.
- Requires discipline to keep specs focused.

## PHP example

```php
<?php

interface Specification
{
    public function isSatisfiedBy(array $candidate): bool;
    public function and(Specification $other): Specification;
    // public function andNot(Specification $other): Specification;
    // public function or(Specification $other): Specification;
    // public function orNot(Specification $other): Specification;
    // public function not(): Specification;
}

abstract class BaseSpecification implements Specification
{
    public function and(Specification $other): Specification
    {
        return new AndSpecification($this, $other);
    }
}

class RoleSpecification extends BaseSpecification
{
    public function __construct(private string $role)
    {
    }

    public function isSatisfiedBy(array $candidate): bool
    {
        return $candidate['role'] === $this->role;
    }
}

class ActiveSpecification extends BaseSpecification
{
    public function isSatisfiedBy(array $candidate): bool
    {
        return $candidate['active'] === true;
    }
}

class AndSpecification extends BaseSpecification
{
    public function __construct(private Specification $left, private Specification $right)
    {
    }

    public function isSatisfiedBy(array $candidate): bool
    {
        return $this->left->isSatisfiedBy($candidate) && $this->right->isSatisfiedBy($candidate);
    }
}

$adminSpec = new RoleSpecification('admin');
$activeSpec = new ActiveSpecification();

$spec = $adminSpec->and($activeSpec);
$user = ['role' => 'admin', 'active' => true];

echo $spec->isSatisfiedBy($user) ? "yes\n" : "no\n";
```
