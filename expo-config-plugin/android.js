const {
  withProjectBuildGradle,
  withAppBuildGradle,
  withAndroidManifest,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withTwilioVoiceAndroid = (config) => {
  // Modify project build.gradle
  config = withProjectBuildGradle(config, (modConfig) => {
    const buildGradle = modConfig.modResults.contents;

    // Check if Google Services plugin is already included
    if (!buildGradle.includes('com.google.gms:google-services')) {
      // Add Google Services plugin for FCM
      const modifiedBuildGradle = buildGradle.replace(
        /dependencies\s*{/,
        `dependencies {
        classpath 'com.google.gms:google-services:4.3.15'`
      );

      modConfig.modResults.contents = modifiedBuildGradle;
    }

    return modConfig;
  });

  // Modify app build.gradle
  config = withAppBuildGradle(config, (modConfig) => {
    const buildGradle = modConfig.modResults.contents;

    // Check if Google Services plugin is already applied
    if (
      !buildGradle.includes("apply plugin: 'com.google.gms.google-services'")
    ) {
      // Apply Google Services plugin
      const modifiedBuildGradle =
        buildGradle + "\napply plugin: 'com.google.gms.google-services'\n";

      modConfig.modResults.contents = modifiedBuildGradle;
    }

    return modConfig;
  });

  // Add config.xml for FCM settings
  config = withAndroidManifest(config, async (modConfig) => {
    const mainAppPath = path.join(
      modConfig.modRequest.projectRoot,
      'android',
      'app',
      'src',
      'main'
    );
    const valuesPath = path.join(mainAppPath, 'res', 'values');

    if (!fs.existsSync(valuesPath)) {
      fs.mkdirSync(valuesPath, { recursive: true });
    }

    const configPath = path.join(valuesPath, 'config.xml');
    const configContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <bool name="twiliovoicereactnative_firebasemessagingservice_enabled">true</bool>
</resources>`;

    fs.writeFileSync(configPath, configContent);

    // Add required permissions to AndroidManifest.xml
    const androidManifest = modConfig.modResults;

    // Ensure we have the manifest node
    if (!androidManifest.manifest) {
      return modConfig;
    }

    // Add permissions if they don't exist
    const permissions = [
      'android.permission.RECORD_AUDIO',
      'android.permission.READ_PHONE_STATE',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.WAKE_LOCK',
      'android.permission.VIBRATE',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.MODIFY_AUDIO_SETTINGS',
      'android.permission.BLUETOOTH',
      'android.permission.BLUETOOTH_ADMIN',
    ];

    // Get existing permissions
    const existingPermissions =
      androidManifest.manifest['uses-permission'] || [];
    const existingPermissionNames = existingPermissions.map(
      (perm) => perm.$['android:name']
    );

    // Add missing permissions
    permissions.forEach((permission) => {
      if (!existingPermissionNames.includes(permission)) {
        if (!androidManifest.manifest['uses-permission']) {
          androidManifest.manifest['uses-permission'] = [];
        }
        androidManifest.manifest['uses-permission'].push({
          $: {
            'android:name': permission,
          },
        });
      }
    });

    // Add required features
    const features = [{ name: 'android.hardware.microphone', required: true }];

    // Get existing features
    const existingFeatures = androidManifest.manifest['uses-feature'] || [];
    const existingFeatureNames = existingFeatures.map(
      (feature) => feature.$['android:name']
    );

    // Add missing features
    features.forEach((feature) => {
      if (!existingFeatureNames.includes(feature.name)) {
        if (!androidManifest.manifest['uses-feature']) {
          androidManifest.manifest['uses-feature'] = [];
        }
        androidManifest.manifest['uses-feature'].push({
          $: {
            'android:name': feature.name,
            'android:required': feature.required.toString(),
          },
        });
      }
    });

    return modConfig;
  });

  return config;
};

module.exports = withTwilioVoiceAndroid;
