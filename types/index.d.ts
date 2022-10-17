import type { Transform } from "./transform";

export type CamelCase<S extends string> = Transform<S, "camel">;
export type KebabCase<S extends string> = Transform<S, "kebab">;
export type PascalCase<S extends string> = Transform<S, "pascal">;
export type SnakeCase<S extends string> = Transform<S, "snake">;

/**
 * Converts the input into camel case.
 */
export function camelCase<S extends string>(input: S): CamelCase<S>;
/**
 * Converts the input into kebab case.
 */
export function kebabCase<S extends string>(input: S): KebabCase<S>;
/**
 * Converts the input into pascal case.
 */
export function pascalCase<S extends string>(input: S): PascalCase<S>;
/**
 * Converts the input into snake case.
 */
export function snakeCase<S extends string>(input: S): SnakeCase<S>;
