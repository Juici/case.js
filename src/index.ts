import { capitalize, transform } from "./util";

import type { CamelCase, KebabCase, PascalCase, SnakeCase } from "../types";
export type { CamelCase, KebabCase, PascalCase, SnakeCase } from "../types";

/**
 * Converts the input into camel case.
 */
export function camelCase<S extends string>(input: S): CamelCase<S> {
  let first = true;
  return transform(
    input,
    (w) => {
      if (first) {
        first = false;
        return w.toLowerCase();
      } else {
        return capitalize(w);
      }
    },
    "",
  ) as CamelCase<S>;
}

/**
 * Converts the input into kebab case.
 */
export function kebabCase<S extends string>(input: S): KebabCase<S> {
  return transform(input, (w) => w.toLowerCase(), "-") as KebabCase<S>;
}

/**
 * Converts the input into pascal case.
 */
export function pascalCase<S extends string>(input: S): PascalCase<S> {
  return transform(input, (w) => capitalize(w), "") as PascalCase<S>;
}

/**
 * Converts the input into snake case.
 */
export function snakeCase<S extends string>(input: S): SnakeCase<S> {
  return transform(input, (w) => w.toLowerCase(), "_") as SnakeCase<S>;
}
