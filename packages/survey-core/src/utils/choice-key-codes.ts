// 1-based bijective base-26, the same order as spreadsheet columns: 1 -> A, 26 -> Z, 27 -> AA.
export function indexToChoiceKeyCode(n: number): string {
  if (!Number.isInteger(n) || n < 1) return "";
  let code = "";
  let num = n;
  while(num > 0) {
    num--;
    code = String.fromCharCode(65 + (num % 26)) + code;
    num = Math.floor(num / 26);
  }
  return code;
}
export function choiceKeyCodeToIndex(code: string): number {
  if (!code || !/^[A-Z]+$/.test(code)) return 0;
  let index = 0;
  for (let i = 0; i < code.length; i++) {
    index = index * 26 + (code.charCodeAt(i) - 64);
  }
  return index;
}
export function choiceKeyCodeHasLongerMatch(code: string, count: number): boolean {
  const next = choiceKeyCodeToIndex(code + "A");
  return next >= 1 && next <= count;
}
