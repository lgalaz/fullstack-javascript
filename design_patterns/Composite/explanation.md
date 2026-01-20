# Composite

## Overview

Composes objects into tree structures to represent part-whole hierarchies.

## When to use

- You want to treat individual objects and groups uniformly.
- You need tree-like structures (for example, UI components or file systems).
- Operations should apply recursively.

## Trade-offs

- Can make it harder to enforce constraints on leaves vs composites.
- Debugging recursive operations can be complex.
- May hide performance costs of deep trees.
## PHP example

```php
<?php

interface Node
{
    public function getSize(): int;
}

class FileNode implements Node
{
    public function __construct(private string $name, private int $size)
    {
    }

    public function getSize(): int
    {
        return $this->size;
    }
}

class FolderNode implements Node
{
    private array $children = [];

    public function add(Node $node): void
    {
        $this->children[] = $node;
    }

    public function getSize(): int
    {
        return array_sum(array_map(fn (Node $node) => $node->getSize(), $this->children));
    }
}

$root = new FolderNode();
$root->add(new FileNode('a.txt', 120));
$root->add(new FileNode('b.txt', 80));

echo $root->getSize() . "\n";
```
