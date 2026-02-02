'use strict';

// Demonstrate event loop delay using monitorEventLoopDelay.
// Run: node event_loop_delay.js
// Optional: set DELAY_MS=2000 to change the blocking duration.

const { monitorEventLoopDelay } = require('node:perf_hooks');

const h = monitorEventLoopDelay({ resolution: 10 });
h.enable();

const blockMs = Number(process.env.DELAY_MS || 1000);

function blockCpu(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // Busy loop to block the event loop.
    Math.sqrt(Math.random());
  }
}

let tick = 0;
setInterval(() => {
  tick += 1;

  if (tick % 3 === 0) {
    blockCpu(blockMs);
  }

  const meanMs = (h.mean / 1e6).toFixed(2);
  const maxMs = (h.max / 1e6).toFixed(2);
  const p99Ms = (h.percentile(99) / 1e6).toFixed(2);

  console.log(
    'tick',
    tick,
    'mean',
    `${meanMs}ms`,
    'p99',
    `${p99Ms}ms`,
    'max',
    `${maxMs}ms`
  );

  h.reset();
}, 1000);
