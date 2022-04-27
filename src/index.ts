import type { CamelCase } from "./camel-case";
export type { CamelCase } from "./camel-case";

const LOWERCASE = /^[\p{Ll}]+$/u;
const UPPERCASE = /^[\p{Lu}]+$/u;
const NON_ALPHANUMERIC = /[^\p{Alpha}\p{N}]/gu;

function segments(input: string): string[] {
  return input.split(NON_ALPHANUMERIC);
}

function chars(s: string):
  | {
      done: false;
      next: () => [string, number];
      peek: () => [string, number] | null;
    }
  | {
      done: true;
      next: () => null;
      peek: () => null;
    } {
  const it = s[Symbol.iterator]();

  let i = 0;
  let peeked: string | null = it.next().value ?? null;

  return {
    done: peeked === null,
    next() {
      let c: string;
      if (peeked) {
        c = peeked;
        peeked = null;
      } else {
        c = it.next().value;
        if (!c) {
          this.done = true;
          this.next = () => null;
          this.peek = () => null;
          return null;
        }
      }

      const idx = i;
      i += c.length;
      return [c, idx];
    },
    peek() {
      if (peeked === null) {
        peeked = it.next().value;
        if (!peeked) {
          this.peek = () => null;
          return null;
        }
      }
      return [peeked, i];
    },
  } as ReturnType<typeof chars>;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

const enum WordMode {
  /** There have been no lowercase or uppercase characters in the current word. */
  Boundary,
  /** The previous cased character in the current word in lowercase */
  Lowercase,
  /** The previous cased character in the current word in uppercase */
  Uppercase,
}

export default function camelCase<S extends string>(input: S): CamelCase<S> {
  let first = true;
  let ret = "";

  for (const word of segments(input)) {
    let init = 0;
    let mode = WordMode.Boundary;

    const it = chars(word);
    while (!it.done) {
      const [c, i] = it.next();

      const peeked = it.peek();
      if (peeked) {
        const [next, nextIdx] = peeked;

        // The mode including the current character, assuming the current
        // character does not result in a word boundary.
        let nextMode: WordMode;
        if (LOWERCASE.test(c)) {
          nextMode = WordMode.Lowercase;
        } else if (UPPERCASE.test(c)) {
          nextMode = WordMode.Uppercase;
        } else {
          nextMode = mode;
        }

        if (nextMode === WordMode.Lowercase && UPPERCASE.test(next)) {
          // Next is underscore or current is not uppercase and next is
          // uppercase, at a word boundary.
          const chunk = word.slice(init, nextIdx);
          if (first) {
            ret += chunk.toLowerCase();
            first = false;
          } else {
            ret += capitalize(chunk);
          }
          init = nextIdx;
          mode = WordMode.Boundary;
        } else if (
          mode === WordMode.Uppercase &&
          UPPERCASE.test(c) &&
          LOWERCASE.test(next)
        ) {
          // Current and previous are uppercase and next is lowercase, word
          // boundary before.
          const chunk = word.slice(init, i);
          if (first) {
            ret += chunk.toLowerCase();
            first = false;
          } else {
            ret += capitalize(chunk);
          }
          init = i;
          mode = WordMode.Boundary;
        } else {
          // No word boundary, just update the mode.
          mode = nextMode;
        }
      } else {
        // Collect trailing characters as a word.
        const chunk = word.slice(init);
        if (first) {
          ret += chunk.toLowerCase();
          first = false;
        } else {
          ret += capitalize(chunk);
        }
        break;
      }
    }
  }

  return ret as CamelCase<S>;
}
