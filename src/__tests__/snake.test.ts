import { snakeCase } from "../index";

import type { SnakeCase } from "../index";

function t<S extends string>(input: S, expected: SnakeCase<S>) {
  test(`"${input}" -> "${expected}"`, () => {
    expect(snakeCase(input)).toBe(expected);
  });
}

t("CamelCase", "camel_case");
t("This is Human case.", "this_is_human_case");
t("MixedUP CamelCase, with some Spaces", "mixed_up_camel_case_with_some_spaces");
t("mixed_up_ snake_case with some _spaces", "mixed_up_snake_case_with_some_spaces");
t("kebab-case", "kebab_case");
t("SHOUTY_SNAKE_CASE", "shouty_snake_case");
t("snake_case", "snake_case");
t("this-contains_ ALLKinds OfWord_Boundaries", "this_contains_all_kinds_of_word_boundaries");
t("XΣXΣ baﬄe", "xσxς_baﬄe");
t("XMLHttpRequest", "xml_http_request");
t("FIELD_NAME11", "field_name11");
t("99BOTTLES", "99bottles");
t("FieldNamE11", "field_nam_e11");

t("abc123def456", "abc123def456");
t("abc123DEF456", "abc123_def456");
t("abc123Def456", "abc123_def456");
t("abc123DEf456", "abc123_d_ef456");
t("ABC123def456", "abc123def456");
t("ABC123DEF456", "abc123def456");
t("ABC123Def456", "abc123_def456");
t("ABC123DEf456", "abc123d_ef456");
t("ABC123dEEf456FOO", "abc123d_e_ef456_foo");
t("abcDEF", "abc_def");
t("ABcDE", "a_bc_de");
