'use strict';

console.log('Emitting warnings. Use --trace-warnings to see stack traces.');

process.emitWarning('This is a custom warning example.', {
  code: 'DBG001',
  type: 'DebugWarning'
});

setTimeout(() => {
  process.emitWarning('Another warning from a later tick.', {
    code: 'DBG002',
    type: 'DebugWarning'
  });
}, 500);
