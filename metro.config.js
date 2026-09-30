const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// 16 keeps Tailwind's spacing scale on a 4px grid (NativeWind defaults to 14).
// noinspection JSCheckFunctionSignatures
module.exports = withNativeWind(config, { input: './src/global.css', inlineRem: 16 });
