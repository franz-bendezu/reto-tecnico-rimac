/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  "collectCoverageFrom": [
    "src/**/*"
  ],
  transform: {
    "^.+\.tsx?$": ["ts-jest", {}],
  },
};