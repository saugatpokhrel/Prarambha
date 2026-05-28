"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAllWords,
  addWord,
  removeWord,
  setActiveWord,
  getActiveWord,
} from "@/app/actions/wordle";
import type { WordleWord } from "@/types/index";
import { toast } from "sonner";

export default function WordleManager() {
  const [words, setWords] = useState<WordleWord[]>([]);
  const [activeWord, setActiveWordState] = useState<WordleWord | null>(null);
  const [loading, setLoading] = useState(true);
  const [newWord, setNewWord] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [settingActive, setSettingActive] = useState<string | null>(null);

  const fetchWords = useCallback(async () => {
    const [wordsResult, activeResult] = await Promise.all([
      getAllWords(),
      getActiveWord(),
    ]);

    if ("error" in wordsResult) {
      toast.error(wordsResult.error);
      return;
    }
    setWords(wordsResult.words);

    if (!("error" in activeResult)) {
      setActiveWordState(activeResult.word);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchWords().finally(() => setLoading(false));
  }, [fetchWords]);

  const handleAdd = async () => {
    const word = newWord.trim().toUpperCase();
    if (!word) return;
    setAdding(true);
    const result = await addWord(word);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success(`"${word}" added!`);
      setNewWord("");
      await fetchWords();
    }
    setAdding(false);
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    const result = await removeWord(id);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Word removed");
      await fetchWords();
    }
    setRemovingId(null);
  };

  const handleSetActive = async (wordId: string) => {
    setSettingActive(wordId);
    const result = await setActiveWord(wordId);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Active word updated");
      await fetchWords();
    }
    setSettingActive(null);
  };

  const handleClearActive = async () => {
    setSettingActive("clear");
    const result = await setActiveWord(null);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Active word cleared (will use random)");
      await fetchWords();
    }
    setSettingActive(null);
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
        Wordle Words
      </h2>

      {/* Active word indicator */}
      <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/30 dark:bg-rose-950/20">
        <p className="text-sm font-medium text-rose-800 dark:text-rose-300">
          Active Word
        </p>
        {loading ? (
          <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">
            Loading…
          </p>
        ) : activeWord ? (
          <div className="mt-1 flex items-center gap-3">
            <span className="text-2xl font-bold tracking-wider text-rose-900 dark:text-rose-200">
              {activeWord.word}
            </span>
            <button
              onClick={handleClearActive}
              disabled={settingActive === "clear"}
              className="text-xs text-rose-500 underline transition hover:text-rose-700 disabled:opacity-50"
            >
              {settingActive === "clear" ? "Clearing…" : "Clear (random)"}
            </button>
          </div>
        ) : (
          <div className="mt-1 flex items-center gap-3">
            <p className="text-sm text-rose-600 dark:text-rose-400">
              None — will pick a random word
            </p>
          </div>
        )}
      </div>

      <p className="mb-6 text-sm text-neutral-500">
        Total: <strong>{words.length}</strong> words
      </p>

      {/* Add word */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          maxLength={5}
          value={newWord}
          onChange={(e) =>
            setNewWord(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          placeholder="5-letter word"
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
        />
        <button
          onClick={handleAdd}
          disabled={adding || newWord.length !== 5}
          className="rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {adding ? "Adding…" : "Add"}
        </button>
      </div>

      {/* Word list */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
          </div>
        ) : words.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-500">
            No words yet. Add one above.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {words.map((w) => {
              const isActive = activeWord?.id === w.id;
              return (
                <div
                  key={w.id}
                  className={`group flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${
                    isActive
                      ? "border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
                      : "border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  }`}
                >
                  <span>{w.word}</span>
                  {!isActive && (
                    <button
                      onClick={() => handleSetActive(w.id)}
                      disabled={settingActive === w.id}
                      className="ml-1 text-xs text-rose-500 opacity-0 transition hover:text-rose-700 group-hover:opacity-100 disabled:opacity-50"
                      title="Set as active word"
                    >
                      {settingActive === w.id ? "…" : "Set"}
                    </button>
                  )}
                  {isActive && (
                    <span className="ml-1 text-xs text-rose-500">●</span>
                  )}
                  <button
                    onClick={() => handleRemove(w.id)}
                    disabled={removingId === w.id}
                    className="text-neutral-400 transition hover:text-red-500 disabled:opacity-50"
                    aria-label={`Remove ${w.word}`}
                  >
                    {removingId === w.id ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
