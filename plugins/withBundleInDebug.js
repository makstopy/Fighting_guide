const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Expo config plugin that sets `debuggableVariants = []` in `android/app/build.gradle`.
 * By default, React Native Gradle Plugin skips bundling JS for 'debuggableVariants' (which defaults to ['debug']).
 * Setting `debuggableVariants = []` forces Gradle to build and bundle JS/assets into Debug APKs,
 * allowing Debug APKs to work standalone without Metro server.
 */
module.exports = function withBundleInDebug(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      if (!config.modResults.contents.includes('debuggableVariants = []')) {
        config.modResults.contents = config.modResults.contents.replace(
          /react\s*\{/,
          'react {\n    debuggableVariants = []'
        );
      }
    }
    return config;
  });
};
