import { pascalCase } from "../index";

import type { PascalCase } from "../index";

function t<S extends string>(input: S, expected: PascalCase<S>) {
  test(`"${input}" -> "${expected}"`, () => {
    expect(pascalCase(input)).toBe(expected);
  });
}

t("PascalCase", "PascalCase");
t("This is Human case.", "ThisIsHumanCase");
t("MixedUP CamelCase, with some Spaces", "MixedUpCamelCaseWithSomeSpaces");
t("mixed_up_ snake_case, with some _spaces", "MixedUpSnakeCaseWithSomeSpaces");
t("SHOUTY_SNAKE_CASE", "ShoutySnakeCase");
t("kebab-case", "KebabCase");
t("snake_case", "SnakeCase");
t("this-contains_ ALLKinds OfWord_ Boundaries", "ThisContainsAllKindsOfWordBoundaries");
t("XΣXΣ baﬄe", "XσxςBaﬄe");
t("XMLHttpRequest", "XmlHttpRequest");
