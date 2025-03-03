module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
  },
  moduleDirectories: ["node_modules", "src"], // Ensure Jest looks inside `src/`
};
