const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Config plugin: regenerate android/local.properties on every `expo prebuild`.
 */
function resolveSdkDir() {
  const fromEnv = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  // Default install locations by platform
  const home = os.homedir();
  const defaults = {
    darwin: path.join(home, 'Library', 'Android', 'sdk'),
    linux: path.join(home, 'Android', 'Sdk'),
    win32: path.join(home, 'AppData', 'Local', 'Android', 'Sdk'),
  };
  return defaults[process.platform] || defaults.linux;
}

module.exports = function withAndroidLocalProperties(config) {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const sdkDir = resolveSdkDir();
      const file = path.join(cfg.modRequest.platformProjectRoot, 'local.properties');
      fs.writeFileSync(file, `sdk.dir=${sdkDir}\n`);
      return cfg;
    },
  ]);
};
