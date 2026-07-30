const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Expo config plugin that adds `bundleInDebug = true` to `android/app/build.gradle`.
 * This forces Expo to bundle JS assets in Debug builds, allowing Debug APKs
 * to run standalone on physical devices without needing a running Metro server.
 */
module.exports = function withBundleInDebug(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      if (!config.modResults.contents.includes('bundleInDebug = true')) {
        config.modResults.contents = config.modResults.contents.replace(
          /react\s*\{/,
          'react {\n    bundleInDebug = true'
        );
      }
    }
    return config;
  });
};
