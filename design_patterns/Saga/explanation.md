# Saga

## Overview

Manages distributed transactions using a series of local steps, where each step defines a compensation (the rollback action to run if a later step fails).

## When to use

- You need multi-service workflows without two-phase commit.
- Failure handling requires explicit compensation.
- Long-running processes should be resilient.

## Trade-offs

- Complexity in coordination and error handling.
- Compensating actions are not always perfect rollbacks.
- Observability is required to debug flows.
## PHP example

```php
<?php

class SagaStep
{
    public function __construct(public callable $action, public callable $compensate)
    {
    }
}

class Saga
{
    private array $steps = [];

    public function addStep(SagaStep $step): void
    {
        $this->steps[] = $step;
    }

    public function execute(): void
    {
        $completed = [];

        try {
            foreach ($this->steps as $step) {
                ($step->action)();
                $completed[] = $step;
            }
        } catch (Throwable $exception) {
            foreach (array_reverse($completed) as $step) {
                ($step->compensate)();
            }
        }
    }
}

$saga = new Saga();
$saga->addStep(new SagaStep(
    fn () => print("reserve inventory
"),
    fn () => print("release inventory
")
));
$saga->addStep(new SagaStep(
    fn () => print("charge card
"),
    fn () => print("refund card
")
));

$saga->execute();
```
