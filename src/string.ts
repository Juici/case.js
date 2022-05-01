import type { NonSurrogate1, NonSurrogate2 } from "./generated/utf16";

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

type CharsInner<
  S extends string,
  Out extends string[],
> = S extends `${infer C1}${infer Tail}`
  ? C1 extends NonSurrogate1 | NonSurrogate2
    ? CharsInner<Tail, [...Out, C1]>
    : Tail extends `${infer C2}${infer Tail2}`
    ? CharsInner<Tail2, [...Out, C1, C2]>
    : never
  : Out;

export type Chars<S extends string> = CharsInner<S, []>;
