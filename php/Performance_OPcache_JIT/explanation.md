# Performance: OPcache and JIT

## OPcache

OPcache is an opcode cache. Opcode is the bytecode PHP generates from your source code. Caching it avoids recompiling on every request. `php.ini` is PHP's main configuration file.
Opcache preloading compiles selected PHP files into opcodes and keeps them in memory at startup. That means class/function definitions are already in OPcache and shared across workers, so they don’t need to be compiled on first use. It’s primarily about warming the opcode cache (not executing code each request).

Typical `php.ini` settings:

```
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
```

## JIT

JIT stands for Just-In-Time compilation. It compiles some bytecode into machine code at runtime. It can help CPU-heavy workloads, but it often has limited impact on typical web apps.

How PHP execution changes:
Normal: PHP → Zend opcodes → Zend VM interprets them (the VM is a C program already compiled to machine code).
JIT: PHP → Zend opcodes → hot opcodes compiled to native machine code at runtime, executed directly. So those hot paths bypass the Zend VM interpreter. But it doesn’t remove the VM entirely—cold paths still run through the VM.

When to consider JIT:

- Heavy numeric processing or tight loops
- Long-running CLI tasks
- After profiling shows CPU hotspots

For most request/response web apps, OPcache delivers the biggest real-world gain.
Note: OPcache preloading can further reduce cold starts by loading classes into memory at startup, but it requires careful deploy/reload coordination because preloaded code is shared across worker processes and only refreshes on PHP-FPM restart, so stale code can persist if deployments don't restart or clear preloads.
