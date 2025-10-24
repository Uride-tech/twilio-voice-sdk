const withTwilioVoiceAndroid = require('./expo-config-plugin/android');
const withTwilioVoiceIOS = require('./expo-config-plugin/ios');

module.exports = {
  name: 'twilio-voice-react-native',
  plugins: [withTwilioVoiceAndroid, withTwilioVoiceIOS],
};
