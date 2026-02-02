'use strict';

function showConsoleTrace() {
  console.trace('Console trace example');
}

function showCaptureStackTrace() {
  const err = new Error('Captured stack');
  Error.captureStackTrace(err, showCaptureStackTrace);
  console.log(err.stack);
}

function showTryCatchStack() {
  try {
    throw new Error('Thrown error stack');
  } catch (err) {
    console.log(err.stack);
  }
}

showConsoleTrace();
showCaptureStackTrace();
showTryCatchStack();
