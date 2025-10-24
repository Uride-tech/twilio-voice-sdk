const {
  withInfoPlist,
  withEntitlementsPlist,
} = require('@expo/config-plugins');

const withTwilioVoiceIOS = (config) => {
  // Add required permissions to Info.plist
  config = withInfoPlist(config, (modConfig) => {
    const infoPlist = modConfig.modResults;

    // Add microphone usage description if it doesn't exist
    if (!infoPlist.NSMicrophoneUsageDescription) {
      infoPlist.NSMicrophoneUsageDescription =
        'This app needs access to your microphone to make and receive voice calls.';
    }

    // Add push notification entitlement
    if (!infoPlist.UIBackgroundModes) {
      infoPlist.UIBackgroundModes = [];
    }

    // Add required background modes if they don't exist
    const requiredBackgroundModes = ['audio', 'voip', 'remote-notification'];

    requiredBackgroundModes.forEach((mode) => {
      if (!infoPlist.UIBackgroundModes.includes(mode)) {
        infoPlist.UIBackgroundModes.push(mode);
      }
    });

    return modConfig;
  });

  // Add required capabilities to Entitlements.plist
  config = withEntitlementsPlist(config, (modConfig) => {
    const entitlementsPlist = modConfig.modResults;

    // Add push notification entitlement
    entitlementsPlist['aps-environment'] = 'development';

    return modConfig;
  });

  return config;
};

module.exports = withTwilioVoiceIOS;
