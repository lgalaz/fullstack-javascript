# Builder

## Overview

Constructs complex objects step by step while keeping construction logic separate from representation.

## When to use

- Object creation has many optional parts or variants.
- You want readable, incremental construction (for example, fluent builders).
- You need to reuse construction logic for different representations.

## Trade-offs

- More code and types than a simple constructor.
- Can hide required fields if not designed carefully.
- Builders can drift from the target object API.
## PHP example

```php
<?php

class House
{
    public function __construct(public array $parts)
    {
    }
}

interface HouseBuilder
{
    public function addFoundation(): void;
    public function addWalls(): void;
    public function addRoof(): void;
    public function getHouse(): House;
}

class StandardHouseBuilder implements HouseBuilder
{
    private array $parts = [];

    public function addFoundation(): void
    {
        $this->parts[] = 'concrete foundation';
    }

    public function addWalls(): void
    {
        $this->parts[] = 'brick walls';
    }

    public function addRoof(): void
    {
        $this->parts[] = 'shingle roof';
    }

    public function getHouse(): House
    {
        return new House($this->parts);
    }
}

class HouseDirector
{
    public function __construct(private HouseBuilder $builder)
    {
    }

    public function buildStandard(): House
    {
        $this->builder->addFoundation();
        $this->builder->addWalls();
        $this->builder->addRoof();

        return $this->builder->getHouse();
    }
}

$director = new HouseDirector(new StandardHouseBuilder());
$house = $director->buildStandard();
print_r($house->parts);
```
