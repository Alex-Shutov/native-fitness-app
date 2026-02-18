import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Typo } from '~/shared/ui/typo/typo';
import { APP_API_URL } from '~/shared/api/const'

const VIDEO_STORAGE_KEY = '@has_watched_intro_video';
const isWeb = Platform.OS === 'web';

const VIDEO_URL = `${APP_API_URL}/uploads/onboarding-video.mp4`;
const videoSource = { uri: VIDEO_URL };

const VideoScreen = ({ navigation, skippable = true, onComplete }) => {
  const videoRef = useRef(null);
  const [webStarted, setWebStarted] = useState(false);

  const startPlayback = () => {
    if (!isWeb) return;
    try {
      videoRef.current?.resume?.();
      setWebStarted(true);
    } catch (e) {
      console.warn('Video resume:', e);
    }
  };

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

  const paused = isWeb ? !webStarted : false;

  return (
    <SafeAreaView style={styles.container}>
      <Video
        source={videoSource}
        ref={videoRef}
        style={styles.video}
        resizeMode="cover"
        controls
        paused={paused}
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
    bottom: 28,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  skipText: {
    color: 'white',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlayText: {
    color: 'white',
    fontSize: 18,
  },
});

export default VideoScreen;