# Chain of Responsibility

## Overview

Passes a request along a chain of handlers until one handles it.

## When to use

- Multiple handlers may process a request.
- You want to decouple senders from receivers.
- Handling order should be configurable.

## Trade-offs

- Requests may go unhandled without clear feedback.
- Order can be subtle and hard to debug.
- Extra indirection for simple routing.
## PHP example

```php
<?php

interface Handler
{
    public function setNext(Handler $handler): Handler;
    public function handle(string $level, string $message): void;
}

abstract class AbstractHandler implements Handler
{
    private ?Handler $next = null;

    public function setNext(Handler $handler): Handler
    {
        $this->next = $handler;

        return $handler;
    }

    public function handle(string $level, string $message): void
    {
        if ($this->next) {
            $this->next->handle($level, $message);
        }
    }
}

class ErrorHandler extends AbstractHandler
{
    public function handle(string $level, string $message): void
    {
        if ($level === 'error') {
            echo "[error] {$message}\n";
            return;
        }

        parent::handle($level, $message);
    }
}

class InfoHandler extends AbstractHandler
{
    public function handle(string $level, string $message): void
    {
        if ($level === 'info') {
            echo "[info] {$message}\n";
            return;
        }

        parent::handle($level, $message);
    }
}

$chain = new ErrorHandler();
$chain->setNext(new InfoHandler());

$chain->handle('info', 'Connected');
$chain->handle('error', 'Disk full');
```
