import type { NonAlphanumeric } from "./generated/unicode";
import type { Chars, IsLowercase, IsUppercase, JoinChars } from "./string";

type SegmentsInner<
  Left extends string[],
  Right extends string[],
  Out extends string[][],
> = Right extends []
  ? Left extends []
    ? Out
    : [...Out, Left]
  : Right extends [infer C, ...infer Tail]
  ? Tail extends string[]
    ? C extends NonAlphanumeric
      ? Left extends []
        ? SegmentsInner<[], Tail, Out>
        : SegmentsInner<[], Tail, [...Out, Left]>
      : C extends string
      ? SegmentsInner<[...Left, C], Tail, Out>
      : never
    : never
  : never;

type Segments<S extends string[]> = SegmentsInner<[], S, []>;

type WordMode = "boundary" | "lowercase" | "uppercase";

type OuterState = {
  first: boolean;
  ret: string;
  segments: string[][];
};
type InnerState = {
  first: boolean;
  mode: WordMode;
  left: string[];
  right: string[];
  ret: string;
};

type HandleChunk<
  S extends InnerState,
  Chunk extends string[],
> = S["first"] extends true
  ? `${S["ret"]}${Lowercase<JoinChars<Chunk>>}`
  : Chunk extends [infer Head, ...infer Tail]
  ? Head extends string
    ? Tail extends string[]
      ? `${S["ret"]}${Uppercase<Head>}${Lowercase<JoinChars<Tail>>}`
      : never
    : never
  : S["ret"];

type GetNextMode<
  S extends InnerState,
  C extends string,
> = IsLowercase<C> extends true
  ? "lowercase"
  : IsUppercase<C> extends true
  ? "uppercase"
  : S["mode"];

type IterInner<S extends InnerState> = S["right"] extends []
  ? S
  : S["right"] extends [infer C]
  ? C extends string
    ? {
        first: false;
        mode: S["mode"];
        left: [];
        right: [];
        ret: HandleChunk<S, [...S["left"], C]>;
      }
    : never
  : S["right"] extends [infer C1, infer C2, ...infer Tail]
  ? C1 extends string
    ? C2 extends string
      ? Tail extends string[]
        ? GetNextMode<S, C1> extends infer NextMode
          ? [NextMode, IsUppercase<C2>] extends ["lowercase", true]
            ? IterInner<{
                first: false;
                mode: "boundary";
                left: [];
                right: [C2, ...Tail];
                ret: HandleChunk<S, [...S["left"], C1]>;
              }>
            : [S["mode"], IsUppercase<C1>, IsLowercase<C2>] extends [
                "uppercase",
                true,
                true,
              ]
            ? IterInner<{
                first: false;
                mode: "boundary";
                left: [C1];
                right: [C2, ...Tail];
                ret: HandleChunk<S, S["left"]>;
              }>
            : NextMode extends WordMode
            ? IterInner<{
                first: S["first"];
                mode: NextMode;
                left: [...S["left"], C1];
                right: [C2, ...Tail];
                ret: S["ret"];
              }>
            : never
          : never
        : never
      : never
    : never
  : never;

type IterOuter<S extends OuterState> = S["segments"] extends []
  ? S["ret"]
  : S["segments"] extends [infer Word, ...infer Tail]
  ? Word extends string[]
    ? Tail extends string[][]
      ? IterInner<{
          first: S["first"];
          mode: "boundary";
          left: [];
          right: Word;
          ret: S["ret"];
        }> extends infer S2
        ? S2 extends InnerState
          ? IterOuter<{
              first: S2["first"];
              ret: S2["ret"];
              segments: Tail;
            }>
          : never
        : never
      : never
    : never
  : never;

export type CamelCase<S extends string> = IterOuter<{
  first: true;
  ret: "";
  segments: Segments<Chars<S>>;
}>;
