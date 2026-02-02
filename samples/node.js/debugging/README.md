# Node Debugging Playground

This folder contains small scripts to exercise Node.js debugging and troubleshooting flags:

- `--inspect`
- `--trace-warnings`
- `--trace-deprecation`
- stack trace capture patterns

## Quick start

```bash
node long_running.js
```

## Inspector

```bash
node --inspect long_running.js
# then open chrome://inspect and click "Inspect"
```

## Heap leak demo

```bash
node --inspect heap_leak.js
# Take heap snapshots over time and compare growth.
```

## CPU profile (flame graph)

```bash
node --inspect prof.js
# then open chrome://inspect and click "Inspect"
```

In DevTools:

- Open the "Performance" panel.
- Click the record button.
- Wait until "Done" prints in the terminal (or ~8 seconds), then stop recording.
- In the flame graph, the widest frames are your hot paths (e.g., `fib`, `busyWork`).

## Event loop delay

```bash
node event_loop_delay.js
# Optionally: DELAY_MS=2000 node event_loop_delay.js
```

## Memory reporting

```bash
node memory_reporting.js
```

## Warnings with stack traces

```bash
node --trace-warnings warnings.js
```

## Deprecation warnings with stack traces

```bash
node --trace-deprecation deprecation.js
```

## Capture stack traces

```bash
node stack_traces.js
```

## Combined example

```bash
node --inspect --trace-warnings --trace-deprecation long_running.js
```
