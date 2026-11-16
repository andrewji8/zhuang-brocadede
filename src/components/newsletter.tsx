"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      className="mt-6 flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        if (email) {
          setDone(true);
          setEmail("");
        }
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="你的邮箱"
        className="flex-1 rounded-pill border border-surface/30 bg-transparent px-5 py-3 text-sm text-surface placeholder:text-surface/50 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-pill bg-surface px-6 py-3 text-sm font-medium text-primary"
      >
        {done ? "已订阅 ✓" : "订阅"}
      </button>
    </form>
  );
}
