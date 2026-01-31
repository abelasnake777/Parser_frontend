"use client";
import { useState } from "react";
import ParsingTypeSelector from "./components/ParsingTypeSelector";
import GrammarInput from "./components/GrammarInput";
import InputField from "./components/InputField";
import ParseSteps from "./components/ParseSteps";

export default function Home() {
  const [parsingType, setParsingType] = useState<"backtracking" | "precedence" | "">("");
  const [grammar, setGrammar] = useState("");
  const [inputString, setInputString] = useState("");
  const [grammarValid, setGrammarValid] = useState(false);
  const [inputValid, setInputValid] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);
  const [terminals, setTerminals] = useState<string[]>([]);

  const extractTerminals = (grammar: string) => {
    const terminalsSet = new Set<string>();
    grammar.split("\n").forEach((line) => {
      const parts = line.split("→")[1]?.split("|").map((p) => p.trim());
      if (parts) {
        parts.forEach((p) => p.split("").forEach((c) => {
          if (c !== "ε" && c.toUpperCase() === c && /[A-Z]/.test(c)) return; // skip non-terminals
          terminalsSet.add(c);
        }));
      }
    });
    setTerminals(Array.from(terminalsSet));
  };

  const handleGrammarValid = () => {
    setGrammarValid(true);
    extractTerminals(grammar);
  };

  const handleInputValid = () => {
    setInputValid(true);
  };

  const handleParse = () => {
    setStepsVisible(false);
    setTimeout(() => setStepsVisible(true), 0); // Clear previous steps
  };

  return (
    <main className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Parser Illustrator</h1>

      <ParsingTypeSelector parsingType={parsingType} setParsingType={(v) => { setParsingType(v); setGrammarValid(false); setInputValid(false); }} />

      <GrammarInput grammar={grammar} setGrammar={setGrammar} enabled={!!parsingType} onValidGrammar={handleGrammarValid} />

      <InputField inputString={inputString} setInputString={setInputString} enabled={grammarValid} terminals={terminals} onValidInput={handleInputValid} />

      <button
        className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ${!inputValid ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleParse}
        disabled={!inputValid}
      >
        Parse
      </button>

      {stepsVisible && <ParseSteps parsingType={parsingType} />}
    </main>
  );
}
