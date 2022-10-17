import { camelCase } from "../index";

import type { CamelCase } from "../index";

function t<S extends string>(input: S, expected: CamelCase<S>) {
  test(`"${input}" -> "${expected}"`, () => {
    expect(camelCase(input)).toBe(expected);
  });
}

t("PascalCase", "pascalCase");
t("This is Human case.", "thisIsHumanCase");
t("MixedUP CamelCase, with some Spaces", "mixedUpCamelCaseWithSomeSpaces");
t("mixed_up_ snake_case, with some _spaces", "mixedUpSnakeCaseWithSomeSpaces");
t("SHOUTY_SNAKE_CASE", "shoutySnakeCase");
t("kebab-case", "kebabCase");
t("snake_case", "snakeCase");
t("this-contains_ ALLKinds OfWord_ Boundaries", "thisContainsAllKindsOfWordBoundaries");
t("XΣXΣ baﬄe", "xσxςBaﬄe");
t("XMLHttpRequest", "xmlHttpRequest");
