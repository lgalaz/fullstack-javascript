export type Operator = '+' | '-' | '*' | '/';

export type FallingExpression = {
  id: number;
  x: number;
  y: number;
  text: string;
  value: number;
  speed: number;
  createdAt: number;
  status: 'falling' | 'landed' | 'cleared';
};

export type LevelConfig = {
  min: number;
  max: number;
  spawnIntervalMs: number;
  speed: number;
};

const OPERATORS: Operator[] = ['+', '-', '*', '/'];

export const TILE_WIDTH = 140;
export const TILE_HEIGHT = 48;

export function getLevelConfig(level: number): LevelConfig {
  const max = 10 + Math.min(40, Math.floor((level - 1) * 2));
  const min = 0;
  const spawnIntervalMs = Math.max(1800, 3200 - level * 120);
  const speed = 20 + level * 4;
  return { min, max, spawnIntervalMs, speed };
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOperator(): Operator {
  return OPERATORS[randInt(0, OPERATORS.length - 1)];
}

export function createExpression(
  id: number,
  level: number,
  fieldWidth: number,
  now: number
): FallingExpression {
  const { min, max, speed } = getLevelConfig(level);
  const op = pickOperator();

  let a = randInt(min, max);
  let b = randInt(min, max);
  let value = 0;
  let text = '';

  if (op === '+') {
    value = a + b;
    text = `${a} + ${b} =`;
  } else if (op === '-') {
    if (b > a) {
      [a, b] = [b, a];
    }
    value = a - b;
    text = `${a} - ${b} =`;
  } else if (op === '*') {
    value = a * b;
    text = `${a} x ${b} =`;
  } else {
    const divisor = Math.max(1, randInt(1, Math.max(2, Math.floor(max / 2))));
    const quotient = randInt(1, Math.max(2, Math.floor(max / 2)));
    const dividend = divisor * quotient;
    value = quotient;
    text = `${dividend} / ${divisor} =`;
  }

  const maxX = Math.max(0, fieldWidth - TILE_WIDTH - 16);
  const x = randInt(8, Math.max(8, maxX));

  return {
    id,
    x,
    y: -TILE_HEIGHT,
    text,
    value,
    speed,
    createdAt: now,
    status: 'falling',
  };
}

export function calculateBonus(y: number, threshold: number, level: number) {
  const ratio = threshold <= 0 ? 0 : Math.min(1, Math.max(0, y / threshold));
  const proximity = Math.round(ratio * 10);
  return proximity + Math.floor(level / 2);
}
