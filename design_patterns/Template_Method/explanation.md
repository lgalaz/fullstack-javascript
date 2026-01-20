# Template Method

## Overview

Defines the skeleton of an algorithm while letting subclasses override steps.

## When to use

- Overall algorithm is fixed but steps vary.
- You want to enforce invariants while allowing customization.
- You want to avoid duplicated algorithm structure.

## Trade-offs

- Inheritance makes change harder than composition.
- Subclasses can break assumptions if not careful.
- Overuse leads to rigid hierarchies.
## PHP example

```php
<?php

abstract class DataImporter
{
    public function import(string $input): void
    {
        $rows = $this->parse($this->read($input));
        $this->save($rows);
    }

    abstract protected function read(string $input): string;
    abstract protected function parse(string $raw): array;
    abstract protected function save(array $rows): void;
}

class CsvImporter extends DataImporter
{
    protected function read(string $input): string
    {
        return $input;
    }

    protected function parse(string $raw): array
    {
        return array_map('str_getcsv', explode("
", trim($raw)));
    }

    protected function save(array $rows): void
    {
        echo "Imported " . count($rows) . " rows\n";
    }
}

$importer = new CsvImporter();
$importer->import("name,age
Ada,36");
```
