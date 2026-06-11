const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** Pin Metro to apps/partner — avoids resolving the wrong app/ folder in the monorepo. */
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.watchFolders = [projectRoot];
config.resolver.nodeModulesPaths = [path.join(projectRoot, 'node_modules')];

module.exports = config;
