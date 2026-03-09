import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transformIgnorePatterns: ['node_modules/(?!(.pnpm|.*\\.mjs$|@angular/common/locales/.*\\.js$|fast-sudoku-solver/))'],
  moduleNameMapper: {
    'fast-sudoku-solver': '<rootDir>/node_modules/fast-sudoku-solver/dist/index.js',
  },
};

export default config;
