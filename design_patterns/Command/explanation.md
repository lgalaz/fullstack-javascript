# Command

## Overview

Encapsulates a request as an object, allowing parameterization and queuing.
A .cmd or .queue in JS libraries is typically a list of command objects or functions to execute later—same core idea: encapsulate a request, queue it, and run it when ready. The difference is that many JS queues use plain functions instead of formal command classes, but it’s still the Command pattern in spirit.

## When to use

- You need undo/redo or transactional operations.
- Requests should be queued, logged, or retried.
- You want to decouple invoker from receiver.

## Trade-offs

- Many small command classes can add overhead.
- Can be heavy for simple actions.
- Requires careful management of command state.
## PHP example

```php
<?php

interface Command
{
    public function execute(): void;
}

class Light
{
    public function on(): void
    {
        echo "Light on\n";
    }
}

class LightOnCommand implements Command
{
    public function __construct(private Light $light)
    {
    }

    public function execute(): void
    {
        $this->light->on();
    }
}

class RemoteControl
{
    public function __construct(private Command $command)
    {
    }

    public function pressButton(): void
    {
        $this->command->execute();
    }
}

class CommandQueue
{
    /** @var Command[] */
    private array $queue = [];

    public function enqueue(Command $command): void
    {
        $this->queue[] = $command;
    }

    public function run(): void
    {
        while ($command = array_shift($this->queue)) {
            $command->execute();
        }
    }
}

$light = new Light();
$queue = new CommandQueue();
$queue->enqueue(new LightOnCommand($light));
$queue->enqueue(new LightOnCommand($light));
$queue->run();
```
