# Clean Architecture

## Overview

Structures code in concentric layers with dependencies pointing inward.

## When to use

- You want a stable domain model insulated from frameworks.
- Testability and long-term maintainability are priorities.
- You need clear separation of use cases and interfaces.

## Trade-offs

- Adds boilerplate and indirection.
- More files and layers to navigate.
- Can slow early development if over-applied.
## PHP example

```php
<?php

class User
{
    public function __construct(public string $email)
    {
    }
}

interface UserRepository
{
    public function add(User $user): void;
    public function exists(string $email): bool;
}

interface RegisterUserOutput
{
    public function success(User $user): void;
    public function failure(string $reason): void;
}

class RegisterUser
{
    public function __construct(private UserRepository $repository, private RegisterUserOutput $output)
    {
    }

    public function execute(string $email): void
    {
        if ($this->repository->exists($email)) {
            $this->output->failure('Email already registered');
            return;
        }

        $user = new User($email);
        $this->repository->add($user);
        $this->output->success($user);
    }
}

class InMemoryUserRepository implements UserRepository
{
    private array $users = [];

    public function add(User $user): void
    {
        $this->users[$user->email] = $user;
    }

    public function exists(string $email): bool
    {
        return isset($this->users[$email]);
    }
}

class ConsoleRegisterOutput implements RegisterUserOutput
{
    public function success(User $user): void
    {
        echo "Registered {$user->email}\n";
    }

    public function failure(string $reason): void
    {
        echo "Failed: {$reason}\n";
    }
}

$useCase = new RegisterUser(new InMemoryUserRepository(), new ConsoleRegisterOutput());
$useCase->execute('ada@example.com');
```
