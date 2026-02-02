// CPU profiling demo
// Run with: node --inspect prof.js

function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

function busyWork(durationMs) {
  const end = Date.now() + durationMs;
  let total = 0;
  while (Date.now() < end) {
    total += fib(28);
  }
  return total;
}

function main() {
  console.log('Starting CPU load...');
  const result = busyWork(8000);
  console.log('Done:', result);
}

main();
