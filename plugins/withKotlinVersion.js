const { withGradleProperties } = require('expo/config-plugins');

/**
 * Expo config plugin that pins the Kotlin version in gradle.properties.
 * This prevents Pika plugin compatibility issues with newer Kotlin versions
 * that get auto-resolved by React Native Gradle Plugin.
 */
const withKotlinVersion = (config, kotlinVersion = '2.1.20') => {
  return withGradleProperties(config, (config) => {
    const properties = config.modResults;

    // Remove existing kotlin.version if present
    const existingIndex = properties.findIndex(
      (item) => item.type === 'property' && item.key === 'kotlin.version'
    );
    if (existingIndex !== -1) {
      properties.splice(existingIndex, 1);
    }

    // Add pinned kotlin version
    properties.push({
      type: 'property',
      key: 'kotlin.version',
      value: kotlinVersion,
    });

    return config;
  });
};

module.exports = withKotlinVersion;
