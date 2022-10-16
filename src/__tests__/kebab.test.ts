import { kebabCase } from "../index";

import type { KebabCase } from "../index";

function t<S extends string>(input: S, expected: KebabCase<S>) {
  test(`"${input}" -> "${expected}"`, () => {
    expect(kebabCase(input)).toBe(expected);
  });
}

t("CamelCase", "camel-case");
t("This is Human case.", "this-is-human-case");
t("MixedUP CamelCase, with some Spaces", "mixed-up-camel-case-with-some-spaces");
t("mixed_up_ snake_case with some _spaces", "mixed-up-snake-case-with-some-spaces");
t("kebab-case", "kebab-case");
t("SHOUTY_SNAKE_CASE", "shouty-snake-case");
t("snake_case", "snake-case");
t("this-contains_ ALLKinds OfWord_Boundaries", "this-contains-all-kinds-of-word-boundaries");
t("XΣXΣ baﬄe", "xσxς-baﬄe");
t("XMLHttpRequest", "xml-http-request");
