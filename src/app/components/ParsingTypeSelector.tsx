// src/app/components/ParsingTypeSelector.tsx
interface Props {
  parsingType: string;
  setParsingType: (v: any) => void;
}

export default function ParsingTypeSelector({ parsingType, setParsingType }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium">Parsing Type</label>
      <select
        className="border p-2 rounded"
        value={parsingType}
        onChange={(e) => setParsingType(e.target.value as any)}
      >
        <option value="">-- Choose Parsing Type --</option>
        <option value="backtracking">Backtracking</option>
        <option value="precedence">Operator Precedence</option>
      </select>
    </div>
  );
}
