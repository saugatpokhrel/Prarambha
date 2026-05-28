"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";

const WORD = "APPLE";
const MAX_ATTEMPTS = 6;

type TileState = "correct" | "present" | "absent" | "empty";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

function getRowStatuses(word: string, guess: string): TileState[] {
  const statuses = Array(word.length).fill("absent") as TileState[];
  const wordLetterCounts: Record<string, number> = {};

  for (const char of word) {
    wordLetterCounts[char] = (wordLetterCounts[char] || 0) + 1;
  }

  for (let i = 0; i < word.length; i++) {
    if (guess[i] === word[i]) {
      statuses[i] = "correct";
      wordLetterCounts[guess[i]]--;
    }
  }

  for (let i = 0; i < word.length; i++) {
    if (statuses[i] !== "correct") {
      const char = guess[i];
      if (wordLetterCounts[char] && wordLetterCounts[char] > 0) {
        statuses[i] = "present";
        wordLetterCounts[char]--;
      }
    }
  }

  return statuses;
}

export default function WordleGame() {
  const word = useMemo(() => WORD.toUpperCase(), []);

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const usedLetters = useMemo(() => {
    const map: Record<string, TileState> = {};
    for (const guess of guesses) {
      const statuses = getRowStatuses(word, guess);
      for (let i = 0; i < guess.length; i++) {
        const char = guess[i];
        const status = statuses[i];
        if (status === "correct") {
          map[char] = "correct";
        } else if (status === "present" && map[char] !== "correct") {
          map[char] = "present";
        } else if (!map[char]) {
          map[char] = "absent";
        }
      }
    }
    return map;
  }, [guesses, word]);

  useEffect(() => {
    if (gameStatus === "playing") {
      inputRef.current?.focus();
    }
  }, [gameStatus]);

  const handleContainerClick = () => {
    if (gameStatus === "playing") {
      inputRef.current?.focus();
    }
  };

  const handleRevealSubmit = useCallback(() => {
    if (currentGuess.length !== word.length) return;

    const updatedGuesses = [...guesses, currentGuess];
    setGuesses(updatedGuesses);
    setCurrentGuess("");

    if (inputRef.current) inputRef.current.value = "";

    if (currentGuess === word) {
      setGameStatus("won");
      return;
    }

    if (updatedGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus("lost");
    }
  }, [currentGuess, guesses, word]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== "playing") return;

      const key = e.key.toUpperCase();

      if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length < word.length) {
          setCurrentGuess((prev) => prev + key);
        }
      }

      if (e.key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      }

      if (e.key === "Enter") {
        handleRevealSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameStatus, guesses, word, handleRevealSubmit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameStatus !== "playing") return;

    const rawValue = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    const targetedValue = rawValue.slice(0, word.length);
    setCurrentGuess(targetedValue);
  };

  const handleVirtualKey = useCallback(
    (key: string) => {
      if (gameStatus !== "playing") return;

      if (key === "Enter") {
        handleRevealSubmit();
      } else if (key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length < word.length) {
          setCurrentGuess((prev) => prev + key);
        }
      }
    },
    [gameStatus, currentGuess, word, handleRevealSubmit]
  );

  const rows = Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
    if (rowIndex < guesses.length) return guesses[rowIndex];
    if (rowIndex === guesses.length) return currentGuess;
    return "";
  });

  return (
    <div
      onClick={handleContainerClick}
      className="flex min-h-dvh flex-col items-center bg-zinc-950 px-2 pb-4 text-white select-none"
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="none"
        value={currentGuess}
        onChange={handleInputChange}
        className="absolute top-0 left-0 h-0 w-0 opacity-0"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck="false"
        disabled={gameStatus !== "playing"}
      />

      <div
        className="flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-center text-3xl font-bold tracking-wide text-zinc-100 sm:text-4xl">
          Wordle
        </h1>
        <p className="-mt-2 text-center text-sm text-zinc-500 sm:text-base">
          Guess the {word.length}-letter word
        </p>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          {rows.map((guess, rowIndex) => {
            const isSubmitted = rowIndex < guesses.length;
            const rowStatuses = isSubmitted ? getRowStatuses(word, guess) : [];

            return (
              <div key={rowIndex} className="flex justify-center gap-1.5 sm:gap-2">
                {Array.from({ length: word.length }, (_, colIndex) => {
                  const letter = guess[colIndex] || "";

                  let state: TileState = "empty";
                  if (isSubmitted) {
                    state = rowStatuses[colIndex];
                  }

                  return (
                    <div
                      key={colIndex}
                      className={`flex aspect-square w-[calc((100vw-4rem)/var(--cols))] max-w-[52px] items-center justify-center rounded-md border text-[clamp(1rem,5vw,1.75rem)] font-bold uppercase transition-all duration-300 sm:h-14 sm:w-14 sm:text-2xl
                        ${
                          state === "correct"
                            ? "border-green-600 bg-green-600 text-white"
                            : state === "present"
                            ? "border-yellow-600 bg-yellow-600 text-white"
                            : state === "absent"
                            ? "border-zinc-700 bg-zinc-700 text-zinc-400"
                            : letter
                            ? "border-zinc-400 bg-zinc-900"
                            : "border-zinc-700 bg-zinc-900"
                        }
                      `}
                      style={{ "--cols": word.length } as React.CSSProperties}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="min-h-[28px] text-center">
          {gameStatus === "won" && (
            <p className="text-lg font-semibold text-green-400 sm:text-xl">
              You guessed the word!
            </p>
          )}
          {gameStatus === "lost" && (
            <p className="text-lg font-semibold text-red-400 sm:text-xl">
              Game Over &mdash;{" "}
              <span className="underline">{word}</span>
            </p>
          )}
        </div>

        <button
          onClick={() => {
            setGuesses([]);
            setCurrentGuess("");
            setGameStatus("playing");
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="mt-2 w-full max-w-xs rounded-lg bg-zinc-100 px-6 py-3 font-semibold text-black transition active:scale-95 hover:bg-zinc-200"
        >
          Restart Game
        </button>
      </div>

      {/* On-screen keyboard */}
      <div className="mt-2 w-full max-w-lg px-1">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="mb-1.5 flex w-full justify-center gap-1">
            {row.map((key) => {
              const isSpecial = key === "Enter" || key === "Backspace";
              const letterState = usedLetters[key];

              let bg = "bg-zinc-600 hover:bg-zinc-500";
              if (letterState === "correct") bg = "bg-green-700 hover:bg-green-600";
              else if (letterState === "present") bg = "bg-yellow-700 hover:bg-yellow-600";
              else if (letterState === "absent") bg = "bg-zinc-800 hover:bg-zinc-700";

              return (
                <button
                  key={key}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handleVirtualKey(key);
                    inputRef.current?.focus();
                  }}
                  className={`flex items-center justify-center rounded font-semibold text-white transition active:scale-90
                    ${isSpecial ? "px-2.5 text-[clamp(0.55rem,2.5vw,0.75rem)] sm:px-4 sm:text-sm" : "aspect-square"}
                    ${isSpecial ? "min-w-[clamp(2rem,9vw,3.5rem)]" : "w-[clamp(1.5rem,7vw,2.5rem)]"}
                    h-[clamp(2.5rem,10vw,3.5rem)] sm:h-[3.25rem] ${bg}
                  `}
                  aria-label={key === "Backspace" ? "Backspace" : key}
                >
                  {key === "Backspace" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    >
                      <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z" />
                    </svg>
                  ) : (
                    key
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
