'use strict';

// Intentionally leak memory by retaining large objects.
// Use with: node --inspect heap_leak.js

console.log('Heap leak demo started. PID:', process.pid);

const leakyStore = [];
let tick = 0;

function makeLargeObject(sizeKb, salt) {
  // Allocate a unique string ~ sizeKb kilobytes to avoid deduplication.
  const base = `${salt}-` + 'x'.repeat(1024);
  return {
    createdAt: Date.now(),
    payload: base.repeat(sizeKb)
  };
}

setInterval(() => {
  tick += 1;
  // Add ~5 MB per tick (5 * 1024 KB)
  leakyStore.push(makeLargeObject(5 * 1024, tick));

  if (tick % 2 === 0) {
    const mem = process.memoryUsage();
    const heapMb = (mem.heapUsed / 1024 / 1024).toFixed(1);
    const rssMb = (mem.rss / 1024 / 1024).toFixed(1);
    console.log('Tick', tick, 'heapUsed ~', heapMb, 'MB', 'rss ~', rssMb, 'MB');
  }
}, 1000);
