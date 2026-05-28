"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getRandomWord } from "@/app/actions/wordle";
import type { Session } from "@supabase/supabase-js";

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

// ── Types ────────────────────────────────────────────────────────────────────
type TileState = "correct" | "present" | "absent" | "empty" | "filled";
type GameStatus = "playing" | "won" | "lost";

interface GameState {
  word: string;
  guesses: string[];
  current: string;
  status: GameStatus;
}

type Action =
  | { type: "TYPE"; letter: string }
  | { type: "BACKSPACE" }
  | { type: "SUBMIT" }
  | { type: "RESTART"; word: string };

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTileStatuses(word: string, guess: string): TileState[] {
  const statuses: TileState[] = Array(WORD_LENGTH).fill("absent");
  const counts: Record<string, number> = {};

  for (const ch of word) counts[ch] = (counts[ch] ?? 0) + 1;

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === word[i]) {
      statuses[i] = "correct";
      counts[guess[i]]--;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (statuses[i] !== "correct" && counts[guess[i]] > 0) {
      statuses[i] = "present";
      counts[guess[i]]--;
    }
  }

  return statuses;
}

function getKeyStates(
  word: string,
  guesses: string[]
): Record<string, TileState> {
  const map: Record<string, TileState> = {};
  for (const guess of guesses) {
    const statuses = getTileStatuses(word, guess);
    for (let i = 0; i < guess.length; i++) {
      const ch = guess[i];
      const st = statuses[i];
      if (st === "correct") map[ch] = "correct";
      else if (st === "present" && map[ch] !== "correct") map[ch] = "present";
      else if (!map[ch]) map[ch] = "absent";
    }
  }
  return map;
}

// ── Reducer ──────────────────────────────────────────────────────────────────
const EMPTY_STATE: GameState = {
  word: "",
  guesses: [],
  current: "",
  status: "playing",
};

function reducer(state: GameState, action: Action): GameState {
  if (action.type === "RESTART") {
    return { word: action.word, guesses: [], current: "", status: "playing" };
  }

  if (state.status !== "playing") return state;

  switch (action.type) {
    case "TYPE":
      if (state.current.length >= WORD_LENGTH) return state;
      return { ...state, current: state.current + action.letter };

    case "BACKSPACE":
      return { ...state, current: state.current.slice(0, -1) };

    case "SUBMIT": {
      if (state.current.length !== WORD_LENGTH) return state;
      const newGuesses = [...state.guesses, state.current];
      const won = state.current === state.word;
      const lost = !won && newGuesses.length >= MAX_ATTEMPTS;
      return {
        ...state,
        guesses: newGuesses,
        current: "",
        status: won ? "won" : lost ? "lost" : "playing",
      };
    }

    default:
      return state;
  }
}

// ── Tile ─────────────────────────────────────────────────────────────────────
function Tile({ letter, state }: { letter: string; state: TileState }) {
  const base =
    "flex aspect-square w-[clamp(2.5rem,12vw,3.5rem)] items-center justify-center rounded-md border-2 text-[clamp(1rem,5vw,1.5rem)] font-bold uppercase transition-colors duration-200 select-none";

  const styles: Record<TileState, string> = {
    correct: "border-green-600 bg-green-600 text-white",
    present: "border-yellow-500 bg-yellow-500 text-white",
    absent:  "border-zinc-600 bg-zinc-700 text-zinc-400",
    filled:  "border-zinc-400 bg-zinc-800 text-white",
    empty:   "border-zinc-700 bg-zinc-900 text-transparent",
  };

  return (
    <div className={`${base} ${styles[state]}`}>
      {letter || " "}
    </div>
  );
}

// ── Key ───────────────────────────────────────────────────────────────────────
function Key({
  label,
  state,
  onPress,
}: {
  label: string;
  state?: TileState;
  onPress: (key: string) => void;
}) {
  const isWide = label === "ENTER" || label === "⌫";

  const base =
    "flex items-center justify-center rounded-md font-semibold transition-all duration-150 active:scale-90 cursor-pointer select-none h-[clamp(2.5rem,10vw,3.25rem)]";

  const widthClass = isWide
    ? "px-2 text-[clamp(0.5rem,2.5vw,0.75rem)] min-w-[clamp(2.5rem,10vw,3.5rem)]"
    : "w-[clamp(1.75rem,7.5vw,2.5rem)] text-[clamp(0.6rem,3vw,0.85rem)]";

  const colorClass =
    state === "correct"
      ? "bg-green-600 text-white border-green-600"
      : state === "present"
      ? "bg-yellow-500 text-white border-yellow-500"
      : state === "absent"
      ? "bg-zinc-700 text-zinc-500 border-zinc-700"
      : "bg-zinc-600 text-white border-zinc-600 hover:bg-zinc-500";

  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onPress(label);
      }}
      aria-label={label === "⌫" ? "Backspace" : label}
      className={`${base} ${widthClass} ${colorClass} border`}
    >
      {label === "⌫" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z" />
        </svg>
      ) : (
        label
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WordleGame() {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE);
  const containerRef = useRef<HTMLDivElement>(null);

  const { word, guesses, current, status } = state;

  const startNewGame = useCallback(async () => {
    setFetchError(null);
    const result = await getRandomWord();
    if ("error" in result) {
      setFetchError(result.error);
      return;
    }
    dispatch({ type: "RESTART", word: result.word });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (session) {
      startNewGame();
    }
  }, [session, startNewGame]);

  const keyStates = useMemo(() => getKeyStates(word, guesses), [word, guesses]);

  const handleKey = useCallback((key: string) => {
    const k = key.toUpperCase();
    if (k === "BACKSPACE" || k === "⌫") dispatch({ type: "BACKSPACE" });
    else if (k === "ENTER") dispatch({ type: "SUBMIT" });
    else if (/^[A-Z]$/.test(k)) dispatch({ type: "TYPE", letter: k });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const k = e.key.toUpperCase();
      if (k === "BACKSPACE" || k === "ENTER" || /^[A-Z]$/.test(k)) {
        e.preventDefault();
        handleKey(k);
      }
    },
    [handleKey]
  );

  const rows = Array.from({ length: MAX_ATTEMPTS }, (_, i) => {
    if (i < guesses.length) return guesses[i];
    if (i === guesses.length) return current;
    return "";
  });

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/games/wordle`,
      },
    });
  };

  // ── Auth loading ──
  if (authLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-950">
        <span className="text-zinc-500 text-sm">Loading…</span>
      </div>
    );
  }

  // ── Not signed in ──
  if (!session) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-zinc-950 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-widest text-zinc-100">
          WORDLE
        </h1>
        <p className="max-w-sm text-zinc-400">
          Sign in with your college account to play Wordle.
        </p>
        <button
          onClick={handleSignIn}
          className="rounded-lg bg-zinc-100 px-8 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-95"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  // ── Fetch error ──
  if (fetchError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-zinc-950 px-4 text-center">
        <p className="text-zinc-400">{fetchError}</p>
        <button
          onClick={startNewGame}
          className="rounded-lg bg-zinc-100 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── Waiting for word to load ──
  if (!state.word) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-950">
        <span className="text-zinc-500 text-sm">Loading game…</span>
      </div>
    );
  }

  // ── Game ──
  return (
    <div
      ref={containerRef}
      tabIndex={0}
      autoFocus
      onKeyDown={handleKeyDown}
      onClick={(e) => (e.currentTarget as HTMLDivElement).focus()}
      className="flex min-h-dvh flex-col items-center bg-zinc-950 px-2 pt-10 text-white outline-none select-none"
    >
      {/* Header */}
      <header className="mb-6 flex w-full max-w-lg flex-col items-center border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold tracking-widest text-zinc-100 sm:text-3xl">
          WORDLE
        </h1>
        <p className="mt-1 text-xs text-zinc-500">Guess the 5-letter word</p>
      </header>

      {/* Board */}
      <div className="mb-4 flex flex-col gap-1.5 sm:gap-2">
        {rows.map((guess, rowIdx) => {
          const submitted = rowIdx < guesses.length;
          const statuses = submitted ? getTileStatuses(word, guess) : null;

          return (
            <div key={rowIdx} className="flex gap-1.5 sm:gap-2">
              {Array.from({ length: WORD_LENGTH }, (_, colIdx) => {
                const letter = guess[colIdx] ?? "";
                let tileState: TileState = "empty";
                if (submitted && statuses) tileState = statuses[colIdx];
                else if (letter) tileState = "filled";

                return <Tile key={colIdx} letter={letter} state={tileState} />;
              })}
            </div>
          );
        })}
      </div>

      {/* Status message */}
      <div className="mb-4 min-h-[28px] text-center">
        {status === "won" && (
          <p className="text-base font-semibold text-green-400 sm:text-lg">
            You got it! 🎉
          </p>
        )}
        {status === "lost" && (
          <p className="text-base font-semibold text-red-400 sm:text-lg">
            The word was{" "}
            <span className="underline underline-offset-2">{word}</span>
          </p>
        )}
      </div>

      {/* Restart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          startNewGame();
          setTimeout(() => containerRef.current?.focus(), 50);
        }}
        className="mb-6 rounded-lg bg-zinc-100 px-8 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-95 sm:text-base"
      >
        New Game
      </button>

      {/* On-screen keyboard */}
      <div className="w-full max-w-lg shrink-0 px-1 pb-4">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="mb-1.5 flex justify-center gap-1 sm:gap-1.5"
          >
            {row.map((key) => (
              <Key
                key={key}
                label={key}
                state={keyStates[key]}
                onPress={handleKey}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
