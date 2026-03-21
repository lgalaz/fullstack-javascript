# Debugging and Troubleshooting

## What matters

- Start with reproducibility, logs, stack traces, and runtime/OS signals such as CPU, memory, restarts, exit codes, and termination events.

## Interview points

- Use `--inspect` for breakpoints and profiling. The inspector is Node’s built-in debug interface that DevTools can attach to.
- Use heap snapshots for leaks and CPU profiles for hot paths. A heap snapshot is a point-in-time view of objects held in memory.
- Runtime flags like `--trace-warnings` and `--trace-deprecation` help explain noisy production behavior.

## Senior notes

- Good debugging is reduction: smallest repro, known inputs, clear timestamps, and correlation IDs.
- Many “Node bugs” are actually downstream latency, deployment issues, or resource exhaustion.
