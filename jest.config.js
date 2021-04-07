module.exports = {
//  rootDir: "tests",
  preset: 'ts-jest',
  reporters: [
    'default',
  ],
  moduleFileExtensions: [
    "js",
    'ts',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns:["/node_modules/", "third_party"],
  testMatch: [
    '**/bestqa/unit/**/*.spec.(js|jsx|ts|tsx)'
  ],
  testURL: 'http://localhost/'
}
