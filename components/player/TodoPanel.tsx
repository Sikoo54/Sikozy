"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Check, ListTodo, Plus, Timer, X } from "lucide-react";

export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export default function TodoPanel({
  todos,
  timerActive,
  onAdd,
  onToggle,
  onRemove,
}: {
  todos: Todo[];
  timerActive: boolean;
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [text, setText] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  };

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="liquid-glass rounded-3xl p-6 md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--txt-faint)]">
          <ListTodo size={14} className="text-[var(--acc)]" />
          Todo list
        </p>
        {timerActive ? (
          <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-[var(--acc-txt)]">
            <Timer size={11} />
            Focus on
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[var(--txt-faint)]">
            {doneCount}/{todos.length} done
          </span>
        )}
      </div>

      {!timerActive ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--chip)]">
            <Timer size={22} className="text-[var(--acc)]" />
          </span>
          <p className="font-playfair text-sm italic text-[var(--txt-soft)]">
            Start the focus timer to open your tasks.
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={submit} className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a task..."
              className="min-w-0 flex-1 rounded-full bg-[var(--chip)] px-4 py-2.5 text-sm text-[var(--txt)] outline-none ring-1 ring-[var(--ring)] transition-all placeholder:text-[var(--txt-faint)] focus:bg-[var(--btn-bg-hover)] focus:ring-[var(--acc)]"
            />
            <button
              type="submit"
              aria-label="Add task"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] text-[var(--acc-txt)] shadow-[0_4px_16px_var(--glow)] transition-transform hover:scale-105"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </form>

          <ul className="mt-5 flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
            {todos.length === 0 && (
              <li className="py-6 text-center">
                <p className="font-playfair text-sm italic text-[var(--txt-soft)]">
                  No tasks yet — add one above.
                </p>
              </li>
            )}
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 transition-all ${
                  todo.done
                    ? "bg-[var(--chip)]/50 ring-[var(--ring)]"
                    : "bg-[var(--chip)] ring-[var(--ring)] hover:bg-[var(--btn-bg-hover)] hover:ring-[var(--acc)]"
                }`}
              >
                <button
                  onClick={() => onToggle(todo.id)}
                  aria-label={todo.done ? "Mark as not done" : "Mark as done"}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${
                    todo.done
                      ? "bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] text-[var(--acc-txt)]"
                      : "border border-[var(--txt-faint)] text-transparent hover:border-[var(--acc)] hover:scale-110"
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </button>
                <span
                  className={`flex-1 text-sm transition-colors ${
                    todo.done
                      ? "text-[var(--txt-faint)] line-through"
                      : "text-[var(--txt)]"
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => onRemove(todo.id)}
                  aria-label="Remove task"
                  className="text-[var(--txt-faint)] opacity-0 transition-all hover:text-[var(--acc)] group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}