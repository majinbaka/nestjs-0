/* eslint-disable @typescript-eslint/no-var-requires */
const scan = require('sonarqube-scanner');

scan.default(
  {
    serverUrl: 'http://localhost:9001',
    options: {
      'sonar.login': 'sqp_8d771a0f6bb966aa1c670a4f9c2e18d35a16f5a4',
      'sonar.token': 'sqp_8d771a0f6bb966aa1c670a4f9c2e18d35a16f5a4',
      'sonar.projectKey': 'a2',
      'sonar.sources': 'src',
      'sonar.tests': 'src',
      'sonar.inclusions': 'src/**/*.ts',
      'sonar.test.inclusions':
        'src/**/*.spec.ts,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.javascript.lcov.reportPaths': './coverage/lcov.info',
    },
  },
  () => {
    console.log('Error Occurred while scanning');
  },
);
