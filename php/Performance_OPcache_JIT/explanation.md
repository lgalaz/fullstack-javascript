# Performance: OPcache and JIT

## OPcache

OPcache is an opcode cache. Opcode is the bytecode PHP generates from your source code. Caching it avoids recompiling on every request. `php.ini` is PHP's main configuration file.

Typical `php.ini` settings:

```
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
```

## JIT

JIT stands for Just-In-Time compilation. It compiles some bytecode into machine code at runtime. It can help CPU-heavy workloads, but it often has limited impact on typical web apps.

When to consider JIT:

- Heavy numeric processing or tight loops
- Long-running CLI tasks
- After profiling shows CPU hotspots

For most request/response web apps, OPcache delivers the biggest real-world gain.
Note: OPcache preloading can further reduce cold starts by loading classes into memory at startup, but it requires careful deploy/reload coordination.
