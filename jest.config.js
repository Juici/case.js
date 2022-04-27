/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  // Make the test runner shut up about legacy stuff.
  transform: {
    "^.+\\.tsx?$": "ts-jest/legacy",
  },
};
