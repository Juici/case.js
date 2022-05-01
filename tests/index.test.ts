import camelCase, { type CamelCase } from "../src/index";

function addTest<S extends string>(input: S, expected: CamelCase<S>) {
  test(`"${input}" -> "${expected}"`, () => {
    expect(camelCase(input)).toBe(expected);
  });
}

addTest("PascalCase", "pascalCase");
addTest("This is Human case.", "thisIsHumanCase");
addTest(
  "MixedUP CamelCase, with some Spaces",
  "mixedUpCamelCaseWithSomeSpaces",
);
addTest(
  "mixed_up_ snake_case, with some _spaces",
  "mixedUpSnakeCaseWithSomeSpaces",
);
addTest("SHOUTY_SNAKE_CASE", "shoutySnakeCase");
addTest("kebab-case", "kebabCase");
addTest("snake_case", "snakeCase");
addTest(
  "this-contains_ ALLKinds OfWord_ Boundaries",
  "thisContainsAllKindsOfWordBoundaries",
);
addTest("XΣXΣ baﬄe", "xσxςBaﬄe");
addTest("XMLHttpRequest", "xmlHttpRequest");
