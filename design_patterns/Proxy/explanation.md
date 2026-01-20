# Proxy

## Overview

Provides a placeholder that controls access to another object.

## When to use

- You need lazy loading or access control.
- You want to add caching, logging, or remote access.
- You want to intercept calls without changing the target.

## Trade-offs

- Extra indirection can complicate debugging.
- Proxy behavior can diverge from the real object.
- Performance overhead for trivial operations.
## PHP example

```php
<?php

interface Image
{
    public function display(): void;
}

class RealImage implements Image
{
    public function __construct(private string $filename)
    {
        echo "Loading {$filename}\n";
    }

    public function display(): void
    {
        echo "Displaying {$this->filename}\n";
    }
}

class ImageProxy implements Image
{
    private ?RealImage $realImage = null;

    public function __construct(private string $filename)
    {
    }

    public function display(): void
    {
        if (!$this->realImage) {
            $this->realImage = new RealImage($this->filename);
        }

        $this->realImage->display();
    }
}

$image = new ImageProxy('photo.png');
$image->display();
```
