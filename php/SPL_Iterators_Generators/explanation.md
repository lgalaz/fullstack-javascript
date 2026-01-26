# SPL, Iterators, and Generators

## SPL (Standard PHP Library)

SPL provides core data structures and interfaces used by frameworks and libraries.
Common interfaces include `Iterator`, `IteratorAggregate`, `Countable`, and `ArrayAccess`.

Iterator means your class is the iterator: you implement current(), next(), key(), valid(), rewind() and it’s used directly in foreach.

IteratorAggregate means your class provides an iterator: you implement getIterator() and return an Iterator (or Traversable). It’s cleaner when your class is a collection and you want to keep iteration logic separate.

```php
<?php
// To work with foreach, you must implement Iterator or IteratorAggregate.
declare(strict_types=1);

final class UserCollection implements IteratorAggregate, Countable {
    public function __construct(private array $items) {}

    public function getIterator(): Traversable {
        return new ArrayIterator($this->items);
    }

    public function count(): int {
        return count($this->items);
    }
}
```

## Generators (`yield`)

Generators are lazy iterators that avoid loading everything into memory.
They implement `Iterator`, so `foreach` automatically calls `rewind()`, `current()`, `next()`, and `valid()` behind the scenes.
You can also advance them manually with `next()` when you want explicit control over iteration.

```php
<?php

declare(strict_types=1);

function readLines(string $path): Generator {
    $handle = fopen($path, 'rb');
    if ($handle === false) {
        throw new RuntimeException('Cannot open file');
    }

    try {
        while (($line = fgets($handle)) !== false) {
            yield rtrim($line, "\r\n");
        }
    } finally {
        fclose($handle);
    }
}

foreach (readLines('data.txt') as $line) {
    // process line
}
```

Manual `next()` example:

```php
<?php

declare(strict_types=1);

function numbers(): Generator {
    yield 1;
    yield 2;
    yield 3;
}

$gen = numbers();
echo $gen->current(); // 1
$gen->next();
echo $gen->current(); // 2
```

`foreach` example:

```php
<?php

declare(strict_types=1);

function numbers(): Generator {
    yield 1;
    yield 2;
    yield 3;
}

foreach (numbers() as $n) {
    echo $n . "\n";
}
```

Use generators for streaming large datasets, ETL pipelines, or report exports.
