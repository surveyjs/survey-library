// A seeded PRNG (mulberry32) and the helpers the generators build on. No Math.random, no Date.now and no
// locale functions: the same seed gives the same output on every machine.
export interface Rng {
  next(): number;
  int(min: number, max: number): number;
  chance(p: number): boolean;
  pick<T>(items: ReadonlyArray<T>): T;
  shuffle<T>(items: Array<T>): Array<T>;
  word(minLength?: number, maxLength?: number): string;
  words(count: number): string;
  textOfLength(length: number): string;
}

const consonants = "bcdfghjklmnprstvwz";
const vowels = "aeiou";

export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number): number => min + Math.floor(next() * (max - min + 1));
  const word = (minLength: number = 2, maxLength: number = 9): string => {
    const length = int(minLength, maxLength);
    let res = "";
    for (let i = 0; i < length; i++) {
      res += i % 2 === 0 ? consonants[int(0, consonants.length - 1)] : vowels[int(0, vowels.length - 1)];
    }
    return res;
  };
  const rng: Rng = {
    next: next,
    int: int,
    chance: (p: number): boolean => next() < p,
    pick: <T>(items: ReadonlyArray<T>): T => items[int(0, items.length - 1)],
    shuffle: <T>(items: Array<T>): Array<T> => {
      for (let i = items.length - 1; i > 0; i--) {
        const j = int(0, i);
        const tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
      }
      return items;
    },
    word: word,
    words: (count: number): string => {
      const res: Array<string> = [];
      for (let i = 0; i < count; i++) res.push(word());
      const text = res.join(" ");
      return text.charAt(0).toUpperCase() + text.substring(1);
    },
    textOfLength: (length: number): string => {
      let text = "";
      while(text.length < length) text += (text ? " " : "") + word();
      text = text.substring(0, Math.max(1, length)).trim() || word(1, 1);
      return text.charAt(0).toUpperCase() + text.substring(1);
    }
  };
  return rng;
}

// A date from integers only: never new Date(y, m, d), which reads the local time zone.
export function isoDate(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
}
