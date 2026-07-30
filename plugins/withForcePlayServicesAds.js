const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withForcePlayServicesAds(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      if (!config.modResults.contents.includes('-Xskip-metadata-version-check')) {
        config.modResults.contents += `

allprojects {
  tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    kotlinOptions {
      freeCompilerArgs += ["-Xskip-metadata-version-check"]
    }
  }
}
`;
      }
    }
    return config;
  });
};
