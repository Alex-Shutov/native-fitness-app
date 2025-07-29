import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkFirstLaunch = async () => {
  try {
    const value = await AsyncStorage.getItem('isAlreadyRegistered');
    return value === 'true';
  } catch (error) {
    console.error('Error checking first launch:', error);
    return false;
  }
};

export const setAppRegistered = async () => {
  try {
    await AsyncStorage.setItem('isAlreadyRegistered', 'true');
  } catch (error) {
    console.error('Error setting app registered:', error);
  }
};