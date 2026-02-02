'use strict';

// Basic memory reporting demo.
// Run: node memory_reporting.js

setInterval(() => {
  const mem = process.memoryUsage();
  console.log({
    rss: Math.round(mem.rss / 1024 / 1024) + ' MB',
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + ' MB'
  });
}, 2000);
