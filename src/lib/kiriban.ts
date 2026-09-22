export type Kiriban = { kind: "special" | "kiriban" | "zorome"; label: string; display: string };

// Exactly 266 / 168 (the two handles, shown as 0266 / 0168) are special.
// キリ番: anything ending in 266 or 168, 1000–9000, and 1111–9999.
export function kiribanOf(n: number): Kiriban | null {
  if (!Number.isInteger(n) || n <= 0) return null;
  if (n === 266 || n === 168) return { kind: "special", label: "特別な番号", display: String(n).padStart(4, "0") };
  const s = String(n);
  if (s.endsWith("266") || s.endsWith("168")) return { kind: "kiriban", label: "キリ番", display: s };
  if (/^[1-9]000$/.test(s)) return { kind: "kiriban", label: "キリ番", display: s };
  if (/^([1-9])\1{3}$/.test(s)) return { kind: "zorome", label: "ゾロ目", display: s };
  return null;
}
