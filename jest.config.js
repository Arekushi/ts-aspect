const TEST_REGEX = '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$';

module.exports = {
    testEnvironment: 'node',
    testTimeout: 30000,
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json'
    ],
    testRegex: TEST_REGEX,
    transform: {
        '^.+\\.(t)s$': 'ts-jest',
    },
    testPathIgnorePatterns: [
        '<rootDir>/build/',
        '<rootDir>/node_modules/',
        '<rootDir>/dist/'
    ],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/index.ts'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 85,
            lines: 90,
        },
    },
    moduleNameMapper: {
        '^@add/(.*)$': ['<rootDir>/src/add/$1'],
        '^@decorator/(.*)$': ['<rootDir>/src/decorator/$1'],
        '^@enum/(.*)$': ['<rootDir>/src/enum/$1'],
        '^@execution/(.*)$': ['<rootDir>/src/execution/$1'],
        '^@functions/(.*)$': ['<rootDir>/src/functions/$1'],
        '^@interfaces/(.*)$': ['<rootDir>/src/interfaces/$1'],
        '^@proxy-func/(.*)$': ['<rootDir>/src/proxy-func/$1'],
        '^@aspect-types/(.*)$': ['<rootDir>/src/aspect-types/$1'],
      }
};
