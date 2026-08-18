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
    <div className="liquid-glass rounded-3xl p-4 md:p-8">
      <div className="mb-4 flex items-center justify-between md:mb-5">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--txt-faint)] md:text-xs">
          <ListTodo size={12} className="text-[var(--acc)] md:hidden" />
          <ListTodo size={14} className="hidden text-[var(--acc)] md:block" />
          Todo list
        </p>
        {timerActive ? (
          <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest text-[var(--acc-txt)] md:px-3 md:py-1 md:text-[10px]">
            <Timer size={10} className="md:hidden" />
            <Timer size={11} className="hidden md:block" />
            Focus on
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-[var(--txt-faint)] md:text-[10px]">
            {doneCount}/{todos.length} done
          </span>
        )}
      </div>

      {!timerActive ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center md:gap-3 md:py-10">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--chip)] md:h-12 md:w-12">
            <Timer size={18} className="text-[var(--acc)] md:hidden" />
            <Timer size={22} className="hidden text-[var(--acc)] md:block" />
          </span>
          <p className="font-playfair text-xs italic text-[var(--txt-soft)] md:text-sm">
            Start the focus timer to open your tasks.
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={submit} className="flex gap-1.5 md:gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a task..."
              className="min-w-0 flex-1 rounded-full bg-[var(--chip)] px-3 py-2 text-xs text-[var(--txt)] outline-none ring-1 ring-[var(--ring)] transition-all placeholder:text-[var(--txt-faint)] focus:bg-[var(--btn-bg-hover)] focus:ring-[var(--acc)] md:px-4 md:py-2.5 md:text-sm"
            />
            <button
              type="submit"
              aria-label="Add task"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] text-[var(--acc-txt)] shadow-[0_4px_16px_var(--glow)] transition-transform hover:scale-105 md:h-10 md:w-10"
            >
              <Plus size={15} strokeWidth={2.5} className="md:hidden" />
              <Plus size={18} strokeWidth={2.5} className="hidden md:block" />
            </button>
          </form>

          <ul className="mt-3 flex max-h-40 flex-col gap-1.5 overflow-y-auto pr-1 md:mt-5 md:max-h-64 md:gap-2">
            {todos.length === 0 && (
              <li className="py-4 text-center md:py-6">
                <p className="font-playfair text-xs italic text-[var(--txt-soft)] md:text-sm">
                  No tasks yet — add one above.
                </p>
              </li>
            )}
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`group flex items-center gap-2 rounded-xl px-3 py-2 ring-1 transition-all md:gap-3 md:rounded-2xl md:px-4 md:py-3 ${
                  todo.done
                    ? "bg-[var(--chip)]/50 ring-[var(--ring)]"
                    : "bg-[var(--chip)] ring-[var(--ring)] hover:bg-[var(--btn-bg-hover)] hover:ring-[var(--acc)]"
                }`}
              >
                <button
                  onClick={() => onToggle(todo.id)}
                  aria-label={todo.done ? "Mark as not done" : "Mark as done"}
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all md:h-5 md:w-5 ${
                    todo.done
                      ? "bg-gradient-to-br from-[var(--acc-from)] via-[var(--acc-mid)] to-[var(--acc-to)] text-[var(--acc-txt)]"
                      : "border border-[var(--txt-faint)] text-transparent hover:border-[var(--acc)] hover:scale-110"
                  }`}
                >
                  <Check size={10} strokeWidth={3} className="md:hidden" />
                  <Check size={12} strokeWidth={3} className="hidden md:block" />
                </button>
                <span
                  className={`flex-1 text-xs transition-colors md:text-sm ${
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