import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Typo } from '~/shared/ui/typo/typo';

const VIDEO_STORAGE_KEY = '@has_watched_intro_video';

const VideoScreen = ({ navigation, skippable = true, onComplete }) => {
  const videoRef = useRef(null);

  const handleVideoEnd = async () => {
    try {
      await AsyncStorage.setItem(VIDEO_STORAGE_KEY, 'true');
      if (onComplete) {
        onComplete();
      } else if (navigation) {
        navigation.replace('Welcome');
      }
    } catch (e) {
      console.error('Error saving video watch status:', e);
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem(VIDEO_STORAGE_KEY, 'true');
      if (onComplete) {
        onComplete();
      } else if (navigation) {
        navigation.replace('Welcome');
      }
    } catch (e) {
      console.error('Error saving video watch status:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Video
        source={require('../../shared/assets/images/onboarding-video.mp4')}
        ref={videoRef}
        style={styles.video}
        resizeMode="cover"
        paused={false}
        onEnd={handleVideoEnd}
        repeat={false}
      />

      {skippable && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Typo style={styles.skipText}>Пропустить</Typo>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  skipButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  skipText: {
    color: 'white',
  },
});

export default VideoScreen;