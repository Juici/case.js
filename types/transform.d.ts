import { Chars, IsLowercase, IsUppercase, Segments } from "./string";

type Output = "camel" | "kebab" | "snake" | "pascal";
type WordMode = "boundary" | "lowercase" | "uppercase";

type OuterState = {
  first: boolean;
  ret: string;
  segments: Array<Array<string>>;
};
type InnerState = {
  first: boolean;
  mode: WordMode;
  left: string;
  right: Array<string>;
  ret: string;
};

type HandleWord<
  S extends InnerState,
  Chunk extends string,
  O extends Output,
> = `${S["ret"]}${O extends "camel"
  ? S["first"] extends true
    ? Lowercase<Chunk>
    : Capitalize<Lowercase<Chunk>>
  : O extends "kebab"
  ? `${S["first"] extends true ? "" : "-"}${Lowercase<Chunk>}`
  : O extends "snake"
  ? `${S["first"] extends true ? "" : "_"}${Lowercase<Chunk>}`
  : O extends "pascal"
  ? Capitalize<Lowercase<Chunk>>
  : never}`;

type NextMode<S extends InnerState, C extends string> = IsLowercase<C> extends true
  ? "lowercase"
  : IsUppercase<C> extends true
  ? "uppercase"
  : S["mode"];

type IterInner<S extends InnerState, O extends Output> = S["right"] extends [infer C, ...infer Tail]
  ? C extends string
    ? Tail extends [infer Next, ...Array<string>]
      ? Next extends string
        ? Tail extends Array<string>
          ? [NextMode<S, C>, IsUppercase<Next>] extends ["lowercase", true]
            ? IterInner<
                {
                  first: false;
                  mode: "boundary";
                  left: "";
                  right: Tail;
                  ret: HandleWord<S, `${S["left"]}${C}`, O>;
                },
                O
              >
            : [S["mode"], IsUppercase<C>, IsLowercase<Next>] extends ["uppercase", true, true]
            ? IterInner<
                {
                  first: false;
                  mode: "boundary";
                  left: C;
                  right: Tail;
                  ret: HandleWord<S, S["left"], O>;
                },
                O
              >
            : IterInner<
                {
                  first: S["first"];
                  mode: NextMode<S, C>;
                  left: `${S["left"]}${C}`;
                  right: Tail;
                  ret: S["ret"];
                },
                O
              >
          : never
        : never
      : {
          first: false;
          mode: S["mode"];
          left: "";
          right: [];
          ret: HandleWord<S, `${S["left"]}${C}`, O>;
        }
    : never
  : S;

type Iter<S extends OuterState, O extends Output> = S["segments"] extends [
  infer Word,
  ...infer Tail,
]
  ? Word extends Array<string>
    ? Tail extends Array<Array<string>>
      ? IterInner<
          {
            first: S["first"];
            mode: "boundary";
            left: "";
            right: Word;
            ret: S["ret"];
          },
          O
        > extends infer S2
        ? S2 extends InnerState
          ? Iter<
              {
                first: S2["first"];
                ret: S2["ret"];
                segments: Tail;
              },
              O
            >
          : never
        : never
      : never
    : never
  : S["ret"];

export type Transform<S extends string, O extends Output> = string extends S
  ? string
  : Iter<
      {
        first: true;
        ret: "";
        segments: Segments<Chars<S>>;
      },
      O
    >;
