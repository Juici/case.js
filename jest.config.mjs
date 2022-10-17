import { createRequire } from "module";

const require = createRequire(import.meta.url);

/**
 * @type {import("jest").Config}
 */
export default {
  collectCoverageFrom: ["src/**/*.ts", "!**/__tests__/**", "!build/**", "!dist/**"],
  modulePathIgnorePatterns: ["build/", "dist/"],
  roots: ["<rootDir>/src/"],
  snapshotFormat: {
    printBasicPrototype: true,
    printFunctionName: true,
  },
  testPathIgnorePatterns: ["/node_modules/", "/build/", "/dist/", "/scripts/", "\\.snap$"],
  transform: {
    /**
     * @type {[string, import("ts-jest").TsJestGlobalOptions]}
     */
    "\\.ts$": [require.resolve("ts-jest"), {}],
  },
  watchPathIgnorePatterns: ["coverage"],
  watchPlugins: [
    require.resolve("jest-watch-typeahead/filename"),
    require.resolve("jest-watch-typeahead/testname"),
  ],
};
