// eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require('path');

module.exports = {
  productName: 'SqliteSee',
  // artifactName: 'SqliteSee',
  appId: 'com.gitee.claudia',
  files: ['dist_electron/**/*', 'package.json'],
  mac: {
    target: ['dmg'],
    icon: 'public/icons/128x128.icns',
  },
  directories: {
    output: 'dist_electron',
  },
};
