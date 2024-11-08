const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withAndroidTabletBlock(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    // Adicione restrições de compatibilidade para bloquear tablets Android
    if (!manifest["supports-screens"]) manifest["supports-screens"] = {};
    manifest["supports-screens"]["android:smallScreens"] = true;
    manifest["supports-screens"]["android:normalScreens"] = true;
    manifest["supports-screens"]["android:largeScreens"] = false;
    manifest["supports-screens"]["android:xlargeScreens"] = false;

    return config;
  });
};
