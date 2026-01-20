# Bridge

## Overview

Decouples an abstraction from its implementation so both can vary independently.
Bridge means the abstraction holds a reference to an implementor interface and delegates work to it. The abstraction and implementor hierarchies are separate so you can vary both independently.

## When to use

- You need to combine multiple abstractions with multiple implementations.
- You want to avoid class explosion from inheritance.
- You anticipate independent evolution of API and implementation.

## Trade-offs

- More indirection to understand.
- Extra abstraction can be unnecessary for small systems.
- Requires careful design of the bridge interface.
## PHP example

```php
<?php

interface Renderer
{
    public function renderCircle(int $x, int $y, int $radius): string;
}

class SvgRenderer implements Renderer
{
    public function renderCircle(int $x, int $y, int $radius): string
    {
        return "<circle cx='{$x}' cy='{$y}' r='{$radius}' />";
    }
}

class CanvasRenderer implements Renderer
{
    public function renderCircle(int $x, int $y, int $radius): string
    {
        return "drawCircle({$x}, {$y}, {$radius})";
    }
}

abstract class Shape
{
    public function __construct(protected Renderer $renderer)
    {
    }

    abstract public function draw(): string;
}

class Circle extends Shape
{
    public function __construct(Renderer $renderer, private int $x, private int $y, private int $radius)
    {
        parent::__construct($renderer);
    }

    public function draw(): string
    {
        return $this->renderer->renderCircle($this->x, $this->y, $this->radius);
    }
}

$circle = new Circle(new SvgRenderer(), 10, 20, 5);
echo $circle->draw() . "\n";
```
