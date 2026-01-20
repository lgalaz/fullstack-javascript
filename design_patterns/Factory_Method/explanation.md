# Factory Method

## Overview

Defines an interface for creating objects while letting subclasses decide which class to instantiate.

## When to use

- Creation logic varies by subclass or runtime configuration.
- You want to isolate construction from usage.
- You need to extend creation without modifying callers.

## Trade-offs

- Extra subclassing and boilerplate.
- Can spread creation logic across many classes.
- Overkill if object creation is trivial.
## PHP example

```php
<?php

interface Document
{
    public function title(): string;
}

class Report implements Document
{
    public function title(): string
    {
        return 'Quarterly Report';
    }
}

abstract class DocumentCreator
{
    abstract protected function createDocument(): Document;

    public function printTitle(): void
    {
        echo $this->createDocument()->title() . "\n";
    }
}

class ReportCreator extends DocumentCreator
{
    protected function createDocument(): Document
    {
        return new Report();
    }
}

$creator = new ReportCreator();
$creator->printTitle();
```
