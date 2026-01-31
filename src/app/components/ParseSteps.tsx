// src/app/components/ParseSteps.tsx
import React from "react";
import ParseTreeRenderer from "./ParseTreeRenderer";

interface Props {
  parsingType: "backtracking" | "precedence" | "";
}

export default function ParseSteps({ parsingType }: Props) {
  return (
    <div className="w-full flex flex-col gap-8 mt-8">
      {parsingType === "backtracking" && (
        <>
          <section className="p-6 border rounded-lg shadow-md"
              style={{
                width: "100vh",
              }}
          >
            <h2 className="font-bold text-xl mb-2">1. Removal of Left Recursion</h2>
            <p className="text-gray-700 text-sm">
              Steps for removing left recursion from the grammar before parsing.
            </p>
          </section>

          <section className="border rounded-lg shadow-md overflow-hidden"
                style={{
                height: "70vh",           // Fixed height — adjust as needed
                width: "100vh",
                overflow: "auto",          // Enables both vertical & horizontal scroll
                position: "relative",
              }}
          >
            <h2 className="font-bold text-xl p-6 pb-4 border-b sticky top-0 z-10" style={{ backgroundColor: "#0a0a0a" }}>2. Parse Tree Construction</h2>
            
            {/* Scrollable Tree Area */}
            <div 
              className="w-full bg-gradient-to-b from-sky-50 to-indigo-100"
              style={{
                height: "70vh",           // Fixed height — adjust as needed
                width: "100vh",
                overflow: "auto",          // Enables both vertical & horizontal scroll
                position: "relative",
              }}
            >
              <ParseTreeRenderer />
            </div>
          </section>
        </>
      )}

      {parsingType === "precedence" && (
        <section className="p-6 border rounded-lg shadow-md">
          <h2 className="font-bold text-xl mb-2">Operator Precedence Parsing Steps</h2>
          <div className="overflow-auto border rounded bg-gray-50 p-8" style={{ height: "400px" }}>
            <p className="text-center text-gray-500 mt-10">
              [Parse Tree UI - Operator Precedence Mode Coming Soon]
            </p>
          </div>
        </section>
      )}
    </div>
  );
}