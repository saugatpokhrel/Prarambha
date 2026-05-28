"use client";

import { useEffect, useMemo, useState, useRef } from "react";

const WORD = "APPLE"; // TODO: Replace with DB value later
const MAX_ATTEMPTS = 6;

type TileState = "correct" | "present" | "absent" | "empty";

export default function WordleGame() {
  const word = useMemo(() => WORD.toUpperCase(), []);

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );

  // Hidden input ref to control mobile keyboard focus
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input automatically on mount and whenever game is playing
  useEffect(() => {
    if (gameStatus === "playing") {
      inputRef.current?.focus();
    }
  }, [gameStatus]);

  // Ensure focus stays active when clicking anywhere on the game container
  const handleContainerClick = () => {
    if (gameStatus === "playing") {
      inputRef.current?.focus();
    }
  };

  // Keyboard Event Listener (Works for Desktop and handles physical keys)
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
  }, [currentGuess, gameStatus, guesses, word]);

  // Shared submission logic
  const handleRevealSubmit = () => {
    if (currentGuess.length !== word.length) return;

    const updatedGuesses = [...guesses, currentGuess];
    setGuesses(updatedGuesses);
    setCurrentGuess("");

    // Clear the mobile input value completely for the next turn
    if (inputRef.current) inputRef.current.value = "";

    if (currentGuess === word) {
      setGameStatus("won");
      return;
    }

    if (updatedGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus("lost");
    }
  };

  // Handle input changes from the hidden element (Captures mobile virtual keyboard)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameStatus !== "playing") return;

    const rawValue = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    
    // Truncate to the maximum word length limit
    const targetedValue = rawValue.slice(0, word.length);
    setCurrentGuess(targetedValue);
  };

  // Catch mobile 'Go' / 'Search' / 'Enter' submit actions from virtual keyboard
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRevealSubmit();
    }
  };

  /**
   * Evaluates the entire guess row at once to accurately allocate 
   * 'correct' and 'present' statuses for duplicate letters.
   */
  const getRowStatuses = (guess: string): TileState[] => {
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
  };

  const rows = Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
    if (rowIndex < guesses.length) return guesses[rowIndex];
    if (rowIndex === guesses.length) return currentGuess;
    return "";
  });

  return (
    <div 
      onClick={handleContainerClick}
      className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 pt-20 pb-12 text-white select-none cursor-pointer"
    >
      {/* CRITICAL FOR MOBILE: Invisible text input box.
        Keeps focus without disturbing UI layouts.
      */}
      <input
        ref={inputRef}
        type="text"
        value={currentGuess}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="absolute top-0 left-0 h-0 w-0 opacity-0 pointer-events-none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck="false"
        disabled={gameStatus !== "playing"}
      />

      <div className="my-auto w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h1 className="mb-2 text-center text-4xl font-bold text-zinc-100">Wordle</h1>
        <p className="mb-8 text-center text-zinc-400">
          Guess the {word.length}-letter word
        </p>

        <div className="space-y-2">
          {rows.map((guess, rowIndex) => {
            const isSubmitted = rowIndex < guesses.length;
            const rowStatuses = isSubmitted ? getRowStatuses(guess) : [];

            return (
              <div key={rowIndex} className="flex justify-center gap-2">
                {Array.from({ length: word.length }, (_, colIndex) => {
                  const letter = guess[colIndex] || "";
                  
                  let state: TileState = "empty";
                  if (isSubmitted) {
                    state = rowStatuses[colIndex];
                  }

                  return (
                    <div
                      key={colIndex}
                      className={`flex h-14 w-14 items-center justify-center rounded-md border text-2xl font-bold uppercase transition-all duration-300
                        ${
                          state === "correct"
                            ? "border-green-600 bg-green-600 text-white"
                            : state === "present"
                            ? "border-yellow-600 bg-yellow-600 text-white"
                            : state === "absent"
                            ? "border-zinc-800 bg-zinc-800 text-zinc-400"
                            : letter 
                            ? "border-zinc-400 bg-zinc-900" 
                            : "border-zinc-700 bg-zinc-900" 
                        }
                      `}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mt-8 min-h-[32px] text-center">
          {gameStatus === "won" && (
            <p className="text-xl font-semibold text-green-400">
              🎉 You guessed the word!
            </p>
          )}
          {gameStatus === "lost" && (
            <p className="text-xl font-semibold text-red-400">
              Game Over — The word was <span className="underline">{word}</span>
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setGuesses([]);
            setCurrentGuess("");
            setGameStatus("playing");
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="mt-4 w-full rounded-lg bg-zinc-100 px-4 py-3 font-semibold text-black transition hover:bg-zinc-200"
        >
          Restart Game
        </button>

        <div className="mt-6 text-center text-sm text-zinc-500">
          Tap anywhere or type using your keyboard to play!
        </div>
      </div>
    </div>
  );
}
