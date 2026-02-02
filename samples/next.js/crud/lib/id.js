let counter = 1000;

export function createId(prefix) {
  counter += 1;
  return `${prefix}_${counter}`;
}
