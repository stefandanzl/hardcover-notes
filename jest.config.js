/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx',  'node', 'cjs'],
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    }
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    verbose: true,
    preset: 'ts-jest',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['js','ts'],

    testMatch: ['**/tests/**/*.test.ts'],

    transformIgnorePatterns: [
        "node_modules/(?!webdav)"
      ]
};