"use client";
import { useState } from "react";

interface Props {
  grammar: string;
  setGrammar: (value: string) => void;
  enabled: boolean;
  onValidGrammar: () => void;
}

export default function GrammarInput({ grammar, setGrammar, enabled, onValidGrammar }: Props) {
  const [error, setError] = useState("");

  const validateGrammar = () => {
    const lines = grammar.split("\n").map((l) => l.trim()).filter(Boolean);
    const seen: Set<string> = new Set();

    for (let line of lines) {
      // LHS validation
      if (!line.includes("→")) {
        setError("Missing arrow (→) in production.");
        return;
      }

      const [lhsRaw, rhsRaw] = line.split("→").map((x) => x.trim());
      const lhs = lhsRaw.toUpperCase();

      if (!/^[A-Z]+'?$/.test(lhs)) {
        setError("LHS must be letters only, optionally with prime (').");
        return;
      }

      // RHS validations
      const rhsParts = rhsRaw.split("|").map((x) => x.trim());
      for (let part of rhsParts) {
        if (part.includes("ε") && part.replace(/\s/g, "") !== "ε") {
          setError("ε must appear alone or in separate production.");
          return;
        }
      }

      if (seen.has(line)) {
        setError("Duplicate production detected.");
        return;
      }
      seen.add(line);
    }

    setError("");
    onValidGrammar(); // Grammar is valid
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGrammar(e.target.value);
  };

  // **Auto-insert arrow on space if LHS is just one letter or one letter + prime**
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!enabled) return;
    if (e.key === " " || e.key === "Spacebar") {
      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd, value } = textarea;
      const before = value.slice(0, selectionStart);
      const after = value.slice(selectionEnd);

      // Check last line
      const lines = before.split("\n");
      const currentLine = lines[lines.length - 1].trim();
      if (/^[A-Za-z]'?$/.test(currentLine)) {
        e.preventDefault(); // prevent actual space
        const newLineValue = before + " → " + after;
        setGrammar(newLineValue);

        // Move cursor to after arrow + space
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 3; // arrow + space length
        }, 0);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold">Grammar</label>
      <textarea
        className={`border p-2 rounded w-full h-32 ${error ? "border-red-500" : ""}`}
        value={grammar}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="E → E + T | T ..."
        disabled={!enabled}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        className={`bg-green-600 text-white px-4 py-1 rounded ${!enabled ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={!enabled}
        onClick={validateGrammar}
      >
        Validate
      </button>
    </div>
  );
}
