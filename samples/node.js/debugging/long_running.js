'use strict';

// A simple long-running loop to keep the process alive for inspection.
console.log('Long-running process started. PID:', process.pid);

let counter = 0;
setInterval(() => {
  counter += 1;
  if (counter % 5 === 0) {
    console.log('Heartbeat', counter);
  }
}, 1000);
