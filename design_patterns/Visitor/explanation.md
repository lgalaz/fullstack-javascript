# Visitor

## Overview

Separates algorithms from object structures by moving operations into visitor objects.

## When to use

- You need many unrelated operations over a stable object structure.
- You want to add operations without changing element classes.
- Double-dispatch is useful for type-specific behavior.

## Trade-offs

- Adding new element types is expensive.
- Visitor interfaces can grow quickly.
- Less intuitive for many developers.
## PHP example

```php
<?php

interface Visitor
{
    public function visitFile(FileNode $file): void;
    public function visitFolder(FolderNode $folder): void;
}

interface Visitable
{
    public function accept(Visitor $visitor): void;
}

class FileNode implements Visitable
{
    public function __construct(public string $name, public int $size)
    {
    }

    public function accept(Visitor $visitor): void
    {
        $visitor->visitFile($this);
    }
}

class FolderNode implements Visitable
{
    public function __construct(public string $name, public array $children)
    {
    }

    public function accept(Visitor $visitor): void
    {
        $visitor->visitFolder($this);
    }
}

class SizeVisitor implements Visitor
{
    public int $total = 0;

    public function visitFile(FileNode $file): void
    {
        $this->total += $file->size;
    }

    public function visitFolder(FolderNode $folder): void
    {
        foreach ($folder->children as $child) {
            $child->accept($this);
        }
    }
}

$files = [new FileNode('a.txt', 10), new FileNode('b.txt', 20)];
$folder = new FolderNode('root', $files);
$visitor = new SizeVisitor();
$folder->accept($visitor);

echo $visitor->total . "\n";
```
