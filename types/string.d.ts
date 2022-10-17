import { Alphanumeric } from "./generated/unicode";
import { LeadingSurrogate } from "./generated/utf16";

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

type CharsInner<S extends string, Out extends Array<string>> = S extends `${infer C1}${infer Tail}`
  ? C1 extends LeadingSurrogate
    ? Tail extends `${infer C2}${infer Tail2}`
      ? CharsInner<Tail2, [...Out, `${C1}${C2}`]>
      : never
    : CharsInner<Tail, [...Out, C1]>
  : Out;

export type Chars<S extends string> = CharsInner<S, []>;

type SegmentsInner<
  Left extends Array<string>,
  Right extends Array<string>,
  Out extends Array<Array<string>>,
> = Right extends [infer C, ...infer Tail]
  ? Tail extends Array<string>
    ? C extends Alphanumeric
      ? SegmentsInner<[...Left, Right[0]], Tail, Out>
      : Left extends []
      ? SegmentsInner<[], Tail, Out>
      : SegmentsInner<[], Tail, [...Out, Left]>
    : never
  : Left extends []
  ? Out
  : [...Out, Left];

export type Segments<S extends Array<string>> = SegmentsInner<[], S, []>;
