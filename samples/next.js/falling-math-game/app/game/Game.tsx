'use client';

import { useEffect, useRef, useState } from 'react';
import {
  calculateBonus,
  createExpression,
  getLevelConfig,
  TILE_HEIGHT,
  TILE_WIDTH,
  type FallingExpression,
} from './math';

const MAX_CONTAINER = 10;
const LEVEL_UP_SECONDS = 26;
const BASE_POINTS = 10;
const CONTAINER_HEIGHT = 120;

type GameStatus = 'ready' | 'running' | 'paused' | 'gameover';

type Explosion = {
  id: number;
  x: number;
  y: number;
  createdAt: number;
};

export default function Game() {
  const [entities, setEntities] = useState<FallingExpression[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [containerCount, setContainerCount] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready');
  const [answer, setAnswer] = useState('');

  const playfieldRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const spawnAtRef = useRef(0);
  const startTimeRef = useRef(0);
  const idRef = useRef(1);
  const explosionIdRef = useRef(1);

  const entitiesRef = useRef<FallingExpression[]>([]);
  const boundsRef = useRef({ width: 0, height: 0 });
  const containerCountRef = useRef(0);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const statusRef = useRef<GameStatus>('ready');

  useEffect(() => {
    statusRef.current = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    const node = playfieldRef.current;
    if (!node) return;

    const updateBounds = () => {
      const rect = node.getBoundingClientRect();
      boundsRef.current = { width: rect.width, height: rect.height };
    };

    updateBounds();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateBounds);
      observer.observe(node);
    } else {
      window.addEventListener('resize', updateBounds);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      } else {
        window.removeEventListener('resize', updateBounds);
      }
    };
  }, []);

  useEffect(() => {
    if (gameStatus === 'running') {
      inputRef.current?.focus();
    }
  }, [gameStatus]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== 'p') return;
      event.preventDefault();
      togglePause();
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);

      if (statusRef.current !== 'running') {
        lastTimeRef.current = now;
        return;
      }

      if (!startTimeRef.current) {
        startTimeRef.current = now;
      }

      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;
      const deltaSeconds = Math.min(0.05, deltaMs / 1000);

      const elapsedSeconds = (now - startTimeRef.current) / 1000;
      const nextLevel = Math.max(1, Math.floor(elapsedSeconds / LEVEL_UP_SECONDS) + 1);
      if (nextLevel !== levelRef.current) {
        levelRef.current = nextLevel;
        setLevel(nextLevel);
      }

      const { spawnIntervalMs, speed } = getLevelConfig(levelRef.current);
      if (!spawnAtRef.current) {
        spawnAtRef.current = now + spawnIntervalMs;
      }

      while (now >= spawnAtRef.current) {
        const entity = createExpression(
          idRef.current++,
          levelRef.current,
          boundsRef.current.width,
          now
        );
        entity.speed = speed + Math.random() * 20;
        entitiesRef.current = [...entitiesRef.current, entity];
        spawnAtRef.current += spawnIntervalMs;
      }

      const containerTop = Math.max(0, boundsRef.current.height - CONTAINER_HEIGHT);
      const threshold = containerTop - TILE_HEIGHT;

      let landedCount = 0;
      const updated: FallingExpression[] = [];

      for (const entity of entitiesRef.current) {
        if (entity.status !== 'falling') continue;
        const nextY = entity.y + entity.speed * deltaSeconds;
        if (nextY >= threshold) {
          landedCount += 1;
        } else {
          updated.push({ ...entity, y: nextY });
        }
      }

      if (landedCount > 0) {
        const nextCount = containerCountRef.current + landedCount;
        containerCountRef.current = nextCount;
        setContainerCount(nextCount);
        if (nextCount >= MAX_CONTAINER) {
          statusRef.current = 'gameover';
          setGameStatus('gameover');
        }
      }

      entitiesRef.current = updated;
      setEntities(updated);

      setExplosions((prev) => {
        if (prev.length === 0) return prev;
        const cutoff = now - 500;
        const next = prev.filter((item) => item.createdAt > cutoff);
        return next.length === prev.length ? prev : next;
      });
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function resetGame() {
    entitiesRef.current = [];
    setEntities([]);
    setExplosions([]);
    containerCountRef.current = 0;
    setContainerCount(0);
    scoreRef.current = 0;
    setScore(0);
    levelRef.current = 1;
    setLevel(1);
    startTimeRef.current = 0;
    spawnAtRef.current = 0;
    lastTimeRef.current = performance.now();
    setGameStatus('running');
    statusRef.current = 'running';
    inputRef.current?.focus();
  }

  function togglePause() {
    if (statusRef.current === 'gameover') return;
    if (statusRef.current === 'running') {
      setGameStatus('paused');
      statusRef.current = 'paused';
      return;
    }
    if (statusRef.current === 'paused') {
      lastTimeRef.current = performance.now();
      setGameStatus('running');
      statusRef.current = 'running';
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (statusRef.current !== 'running') return;

    const parsed = Number(answer);
    if (Number.isNaN(parsed)) {
      setAnswer('');
      inputRef.current?.focus();
      return;
    }

    const candidates = entitiesRef.current.filter(
      (entity) => entity.status === 'falling' && entity.value === parsed
    );

    if (candidates.length === 0) {
      setAnswer('');
      inputRef.current?.focus();
      return;
    }

    const containerTop = Math.max(0, boundsRef.current.height - CONTAINER_HEIGHT);
    const threshold = containerTop - TILE_HEIGHT;
    const target = candidates.reduce((best, current) =>
      current.y > best.y ? current : best
    );

    const updated = entitiesRef.current.filter((entity) => entity.id !== target.id);
    entitiesRef.current = updated;
    setEntities(updated);

    const bonus = calculateBonus(target.y, threshold, levelRef.current);
    const nextScore = scoreRef.current + BASE_POINTS + bonus;
    scoreRef.current = nextScore;
    setScore(nextScore);

    const explosion: Explosion = {
      id: explosionIdRef.current++,
      x: target.x + TILE_WIDTH / 2,
      y: target.y + TILE_HEIGHT / 2,
      createdAt: performance.now(),
    };
    setExplosions((prev) => [...prev, explosion]);

    setAnswer('');
    inputRef.current?.focus();
  }

  const fillRatio = Math.min(1, containerCount / MAX_CONTAINER);

  return (
    <div className="game" onClick={() => inputRef.current?.focus()}>
      <aside className="sidebar left">
        <h1>Falling Math</h1>
        <p>Type the answer, clear the tile, and keep the container below max.</p>
        <div className="tips">
          <p>Tip: Press P to pause/resume.</p>
          <p>Focus stays on the input while you play.</p>
        </div>
      </aside>

      <div className="playfield" ref={playfieldRef}>
        <div className="floating-score">
          <div>
            <span className="label">Score</span>
            <span className="value">{score}</span>
          </div>
          <div>
            <span className="label">Level</span>
            <span className="value">{level}</span>
          </div>
          <div>
            <span className="label">Fill</span>
            <span className="value">
              {containerCount} / {MAX_CONTAINER}
            </span>
          </div>
        </div>

        {entities.map((entity) => (
          <div
            key={entity.id}
            className="tile"
            style={{ transform: `translate(${entity.x}px, ${entity.y}px)` }}
          >
            {entity.text}
          </div>
        ))}
        {explosions.map((explosion) => (
          <div
            key={explosion.id}
            className="explosion"
            style={{ transform: `translate(${explosion.x}px, ${explosion.y}px)` }}
          />
        ))}

        <div className="container">
          <div className="container-label">Container</div>
          <div className="container-meter">
            <div className="container-fill" style={{ width: `${fillRatio * 100}%` }} />
          </div>
        </div>

        {gameStatus === 'paused' && (
          <div className="overlay">
            <div className="overlay-card">
              <h2>Paused</h2>
              <p>Press P or click resume to keep playing.</p>
              <button type="button" onClick={togglePause}>
                Resume
              </button>
            </div>
          </div>
        )}

        {gameStatus === 'ready' && (
          <div className="overlay">
            <div className="overlay-card">
              <h2>Ready?</h2>
              <p>Press start and keep answering before the container fills.</p>
              <button type="button" onClick={resetGame}>
                Start
              </button>
            </div>
          </div>
        )}

        {gameStatus === 'gameover' && (
          <div className="overlay">
            <div className="overlay-card">
              <h2>Game Over</h2>
              <p>Your container is full. Try again?</p>
              <button type="button" onClick={resetGame}>
                Restart
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="sidebar right">
        <form onSubmit={handleSubmit} className="answer-form">
          <label className="label" htmlFor="answer-input">Answer</label>
          <div className="answer-row">
            <input
              id="answer-input"
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Type answer"
              disabled={gameStatus !== 'running'}
            />
            <button type="submit" disabled={gameStatus !== 'running'}>
              Submit
            </button>
          </div>
        </form>
        <div className="button-row">
          <button type="button" className="ghost" onClick={togglePause}>
            {gameStatus === 'paused' ? 'Resume' : 'Pause'} (P)
          </button>
          {gameStatus === 'gameover' ? (
            <button type="button" onClick={resetGame}>
              Restart
            </button>
          ) : (
            <button type="button" onClick={resetGame}>
              Reset
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
