# Facade

## Overview

Provides a simplified interface to a complex subsystem.

## When to use

- You want to reduce coupling to subsystem details.
- You need a clean entry point for clients.
- Subsystem complexity should be hidden from callers.

## Trade-offs

- Can become a god object if it grows too much.
- May hide useful functionality behind a minimal interface.
- Needs maintenance as subsystems evolve.
## PHP example

```php
<?php

class Projector
{
    public function on(): void
    {
        echo "Projector on\n";
    }
}

class Player
{
    public function play(string $movie): void
    {
        echo "Playing {$movie}\n";
    }
}

class Amplifier
{
    public function setVolume(int $level): void
    {
        echo "Volume {$level}\n";
    }
}

class HomeTheaterFacade
{
    public function __construct(private Projector $projector, private Player $player, private Amplifier $amp)
    {
    }

    public function watchMovie(string $movie): void
    {
        $this->projector->on();
        $this->amp->setVolume(5);
        $this->player->play($movie);
    }
}

$facade = new HomeTheaterFacade(new Projector(), new Player(), new Amplifier());
$facade->watchMovie('Inception');
```
