/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  preset: "ts-jest",

  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: "coverage",
  watchPathIgnorePatterns: ["node_modules"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  roots: [
    "<rootDir>"
  ],
  transform: {
    "^.+\\.ts$": "ts-jest",
  }
};

export default config;
