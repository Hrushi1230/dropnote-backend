// jest.config.js
const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  // Where our tests live
  roots: ["<rootDir>/tests"],

  // Pick up .test.ts / .spec.ts files anywhere under /tests
  testMatch: ["**/?(*.)+(spec|test).ts"],

  // TypeScript transform via ts-jest
  transform: {
    ...tsJestTransformCfg,
  },

  // Useful extensions
  moduleFileExtensions: ["ts", "js", "json", "node"],

  // Register global setup/teardown for clean exits
  setupFilesAfterEnv: ["<rootDir>/tests/setupAfterEnv.ts"],

  // Helpful type-checking diagnostics in test output
  globals: {
    "ts-jest": {
      diagnostics: { warnOnly: false }, // fail tests on TS errors
      tsconfig: "tsconfig.json",
    },
  },

  // Silence noisy logs from supertest/express if needed
  // verbose: true,
};
