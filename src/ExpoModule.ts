import { NativeModules, Platform } from 'react-native';
import { requireNativeModule } from 'expo-modules-core';

// Original Native module from Twilio
const { TwilioVoiceReactNative } = NativeModules;

// Expo Native Module
const TwilioVoiceExpo = requireNativeModule('TwilioVoiceExpo');

class ExpoVoiceModule {
  async connect(
    accessToken: string,
    twimlParams = {},
    calleeName = '',
    displayName = ''
  ) {
    if (Platform.OS === 'android') {
      return TwilioVoiceExpo.voice_connect(
        accessToken,
        twimlParams,
        calleeName,
        displayName
      );
    } else if (Platform.OS === 'ios') {
      // For iOS, use the original module
      return TwilioVoiceReactNative.voice_connect(accessToken, twimlParams);
    }
    return null;
  }
}

export default new ExpoVoiceModule();
