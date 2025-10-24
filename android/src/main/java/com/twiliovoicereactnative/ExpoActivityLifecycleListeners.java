package com.twiliovoicereactnative;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import expo.modules.core.interfaces.ReactActivityLifecycleListener;
import expo.modules.core.interfaces.ActivityProvider;
import expo.modules.core.interfaces.Package;


public class ExpoActivityLifecycleListeners implements ReactActivityLifecycleListener {
  private VoiceActivityProxy voiceActivityProxy;
  private Activity currentActivity;


  @Override
  public void onCreate(Activity activity, Bundle savedInstanceState) {
    this.currentActivity = activity;
    this.voiceActivityProxy = new VoiceActivityProxy(activity, new VoiceActivityProxy.PermissionsRationaleNotifier() {
      @Override
      public void displayRationale(String permission) {
        // Display a rationale for why the permission is needed
        String message;
        switch (permission) {
          case android.Manifest.permission.RECORD_AUDIO:
            message = "Microphone permission is needed to make voice calls";
            break;
          case android.Manifest.permission.READ_PHONE_STATE:
            message = "Phone state permission is needed to manage voice calls";
            break;
          default:
            message = "Permission " + permission + " is needed for voice calls";
            break;
        }
        
        if (currentActivity != null) {
          Toast.makeText(currentActivity, message, Toast.LENGTH_LONG).show();
        }
      }
    });
    this.voiceActivityProxy.onCreate(savedInstanceState);
  }

  @Override
  public boolean onNewIntent(Intent intent) {
    if (this.voiceActivityProxy != null) {
      this.voiceActivityProxy.onNewIntent(intent);
    }
    return false;
  }

  @Override
  public void onDestroy(Activity activity) {
    if (this.voiceActivityProxy != null) {
      this.voiceActivityProxy.onDestroy();
    }
    this.currentActivity = null;
  }
}