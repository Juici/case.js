import type {
  NonSurrogate1,
  NonSurrogate2,
  TrailingSurrogate,
} from "./generated/utf16";

export type IsLowercase<C extends string> = Lowercase<C> extends C
  ? Uppercase<C> extends C
    ? false
    : true
  : false;
export type IsUppercase<C extends string> = Uppercase<C> extends C
  ? Lowercase<C> extends C
    ? false
    : true
  : false;

export type Chars<S extends string> = S extends `${infer First}${infer Tail}`
  ? First extends NonSurrogate1 | NonSurrogate2
    ? [First, ...Chars<Tail>]
    : First extends TrailingSurrogate
    ? never
    : Tail extends `${infer Second}${infer Tail2}`
    ? Second extends TrailingSurrogate
      ? [`${First}${Second}`, ...Chars<Tail2>]
      : never
    : never
  : [];

export type JoinChars<S extends string[]> = S extends [
  infer Head,
  ...infer Tail,
]
  ? Head extends string
    ? Tail extends string[]
      ? `${Head}${JoinChars<Tail>}`
      : never
    : never
  : "";
