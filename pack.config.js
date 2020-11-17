// eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require('path');

module.exports = {
  productName: 'SqliteSee',
  // artifactName: 'SqliteSee',
  appId: 'com.gitee.claudia',
  // files: ['bundled/*'],
  mac: {
    target: [], // 'dmg'
    icon: 'public/icons/128x128.icns',
  },
  directories: {
    output: 'release',
  },
  npmRebuild: false,
  fileAssociations: {
    ext: 'sqlite',
    role: 'Viewer',
  },
};
