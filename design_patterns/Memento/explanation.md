# Memento

## Overview

Captures and externalizes an object state so it can be restored later.

## When to use

- You need undo/rollback support.
- State snapshots must not violate encapsulation.
- You want to checkpoint before risky operations.

## Trade-offs

- Snapshot storage can be expensive.
- Serialization can be complex for large object graphs.
- Requires careful lifecycle management of mementos.
## PHP example

```php
<?php

class EditorMemento
{
    public function __construct(public string $content)
    {
    }
}

class Editor
{
    private string $content = '';

    public function type(string $text): void
    {
        $this->content .= $text;
    }

    public function save(): EditorMemento
    {
        return new EditorMemento($this->content);
    }

    public function restore(EditorMemento $memento): void
    {
        $this->content = $memento->content;
    }

    public function content(): string
    {
        return $this->content;
    }
}

$editor = new Editor();
$editor->type('Hello');
$snapshot = $editor->save();
$editor->type(' world');
$editor->restore($snapshot);

echo $editor->content() . "\n"; // prints 'Hello'
```
