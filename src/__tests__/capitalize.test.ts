import { capitalize } from "../util";

// Coverage for the sanity check on empty strings in `capitalize`.
test("empty string", () => {
  expect(capitalize("")).toBe("");
});
