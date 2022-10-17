const LOWERCASE = /^\p{Lowercase}+$/u;
const UPPERCASE = /^\p{Uppercase}+$/u;
const NON_ALPHANUMERIC = /[^\p{Alphabetic}\p{N}]/gu;

function segments(input: string): Array<string> {
  return input.split(NON_ALPHANUMERIC);
}

function charIndices(s: string): {
  next(): IteratorResult<[number, string], void>;
  peek(): IteratorResult<[number, string], void>;
} {
  const it: Iterator<string, void, void> = s[Symbol.iterator]();

  let i = 0;
  let peeked: IteratorResult<[number, string], void> | undefined;

  return {
    next() {
      if (peeked) {
        const ret = peeked;
        peeked = undefined;
        return ret;
      }

      const { done, value } = it.next();
      if (done) {
        return { done: true, value: undefined };
      }

      const idx = i;
      i += value.length;

      return { done: false, value: [idx, value] };
    },
    peek() {
      if (peeked) {
        return peeked;
      }

      const { done, value } = it.next();
      if (done) {
        return (peeked = { done: true, value: undefined });
      }

      const idx = i;
      i += value.length;

      return (peeked = { done: false, value: [idx, value] });
    },
  };
}

export function transform(
  input: string,
  withWord: (word: string) => string,
  boundary: string,
): string {
  /**
   * Tracks the current 'mode' of the transformation algorithm as it scans the
   * input string.
   */
  const enum WordMode {
    /** There have been no lowercase or uppercase characters in the current word. */
    Boundary,
    /** The previous cased character in the current word in lowercase. */
    Lowercase,
    /** The previous cased character in the current word in uppercase. */
    Uppercase,
  }

  let firstWord = true;
  let result = "";

  for (const word of segments(input)) {
    let init = 0;
    let mode = WordMode.Boundary;

    const iter = charIndices(word);

    let next: ReturnType<typeof iter.next>;
    while (!(next = iter.next()).done) {
      const [i, c] = next.value;

      const peeked = iter.peek();
      if (!peeked.done) {
        const [nextIdx, next] = peeked.value;

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
          if (!firstWord) {
            result += boundary;
          }
          firstWord = false;
          result += withWord(word.slice(init, nextIdx));
          init = nextIdx;
          mode = WordMode.Boundary;
        } else if (mode === WordMode.Uppercase && UPPERCASE.test(c) && LOWERCASE.test(next)) {
          // Current and previous are uppercase and next is lowercase, word
          // boundary before.
          if (!firstWord) {
            result += boundary;
          }
          firstWord = false;
          result += withWord(word.slice(init, i));
          init = i;
          mode = WordMode.Boundary;
        } else {
          // No word boundary, just update the mode.
          mode = nextMode;
        }
      } else {
        // Collect trailing characters as a word.
        if (!firstWord) {
          result += boundary;
        }
        firstWord = false;
        result += withWord(word.slice(init));
        break;
      }
    }
  }

  return result;
}

export function capitalize(s: string): string {
  const { done, value: first } = s[Symbol.iterator]().next();
  return done ? "" : first.toUpperCase() + s.slice(first.length).toLowerCase();
}
