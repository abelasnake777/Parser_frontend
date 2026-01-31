"use client";
import { useState } from "react";

interface Props {
  inputString: string;
  setInputString: (value: string) => void;
  enabled: boolean;
  terminals: string[];
  onValidInput: () => void;
}

export default function InputField({ inputString, setInputString, enabled, terminals, onValidInput }: Props) {
  const [error, setError] = useState("");

  const validateInput = () => {
    for (let char of inputString) {
      if (char === "$") continue;
      if (!terminals.includes(char)) {
        setError(`Invalid character: ${char}. Only grammar terminals allowed.`);
        return;
      }
    }
    setError("");
    onValidInput();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputString(val);
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold">Input</label>
      <input
        type="text"
        className={`border p-2 rounded w-full ${error ? "border-red-500" : ""}`}
        value={inputString}
        onChange={handleChange}
        placeholder="Enter input to parse..."
        disabled={!enabled}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        className={`bg-yellow-500 text-white px-4 py-1 rounded ${!enabled ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={!enabled}
        onClick={validateInput}
      >
        Validate
      </button>
    </div>
  );
}
