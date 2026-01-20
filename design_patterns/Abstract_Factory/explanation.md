# Abstract Factory

## Overview

Creates families of related objects without specifying their concrete classes.

## When to use

- You need to switch entire product families (for example, UI themes or drivers).
- Clients should stay decoupled from concrete types.
- You want consistent combinations of objects across a family.

## Trade-offs

- Adds extra types and indirection.
- Harder to extend with new product types.
- Can feel heavy for small codebases.
## PHP example

```php
<?php

interface Button
{
    public function render(): string;
}

interface Checkbox
{
    public function render(): string;
}

class LightButton implements Button
{
    public function render(): string
    {
        return 'Light Button';
    }
}

class LightCheckbox implements Checkbox
{
    public function render(): string
    {
        return 'Light Checkbox';
    }
}

class DarkButton implements Button
{
    public function render(): string
    {
        return 'Dark Button';
    }
}

class DarkCheckbox implements Checkbox
{
    public function render(): string
    {
        return 'Dark Checkbox';
    }
}

interface ThemeFactory
{
    public function createButton(): Button;
    public function createCheckbox(): Checkbox;
}

class LightThemeFactory implements ThemeFactory
{
    public function createButton(): Button
    {
        return new LightButton();
    }

    public function createCheckbox(): Checkbox
    {
        return new LightCheckbox();
    }
}

class DarkThemeFactory implements ThemeFactory
{
    public function createButton(): Button
    {
        return new DarkButton();
    }

    public function createCheckbox(): Checkbox
    {
        return new DarkCheckbox();
    }
}

function renderUi(ThemeFactory $factory): void
{
    echo $factory->createButton()->render() . "\n";
    echo $factory->createCheckbox()->render() . "\n";
}

renderUi(new LightThemeFactory());
renderUi(new DarkThemeFactory());
```
