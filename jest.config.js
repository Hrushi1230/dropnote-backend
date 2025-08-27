const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest", // ✅ Required to use ts-jest
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleFileExtensions: ["ts", "js", "json", "node"], // Optional but helpful
  testMatch: ["**/?(*.)+(spec|test).[tj]s"], // Ensures it picks up .test.ts files
};
