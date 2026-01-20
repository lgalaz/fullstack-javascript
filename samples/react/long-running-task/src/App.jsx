import { useState } from 'react';

function busyWait(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    // Intentional busy loop to simulate a long task.
  }
}

export default function App() {
  const [count, setCount] = useState(0);
  const [lastDuration, setLastDuration] = useState(null);

  function handleClick() {
    const start = performance.now();
    busyWait(120);
    setLastDuration(Math.round(performance.now() - start));
    setCount(c => c + 1);
  }

  return (
    <main className="page">
      <h1>Long Running Task Demo</h1>
      <p>
        Click the button to trigger a ~120ms busy loop on the main thread. It
        should show up as a long task in DevTools Performance.
      </p>
      <button type="button" onClick={handleClick}>
        Trigger Long Task
      </button>
      <div className="stats">
        <span>Clicks: {count}</span>
        <span>Last task: {lastDuration ? `${lastDuration}ms` : 'n/a'}</span>
      </div>
      <ol className="steps">
        <li>Open Chrome DevTools.</li>
        <li>Go to the Performance tab and click Record.</li>
        <li>Click the button a few times.</li>
        <li>Stop recording and inspect the Main thread for long tasks.</li>
      </ol>
    </main>
  );
}
