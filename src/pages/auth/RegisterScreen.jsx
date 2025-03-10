import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSetRecoilState } from 'recoil';

import RegisterForm from './widgets/RegisterForm';
import Button from '../../shared/ui/button';
import Container from '../../shared/ui/layout/Container';
import GradientBackground from '../../shared/ui/layout/GradientBackground';
import ScreenTransition from '../../shared/ui/layout/ScreenTransition';
import Typo from '../../shared/ui/typo';
import { authState } from '../auth/models/auth.atom';

import useZodForm from '~/core/hooks/useZodForm';
import { SPACING } from '~/core/styles/theme';
import { getUserValue } from '~/pages/auth/lib/auth';
import { registerSchema } from '~/pages/auth/models/validate.user';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const setAuthState = useSetRecoilState(authState);
  const form = useZodForm(registerSchema, {
    name: '',
    email: '',
    phone: '',
    password: '',
    agreementAccepted: false,
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    await form.handleSubmit(async (values) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Registering with data:', values);

        setAuthState(getUserValue(values));

        navigation.navigate('Onboarding');
      } catch (error) {
        console.error('Registration error:', error);

        setAuthState((prev) => ({
          ...prev,
          error: 'Registration failed: ' + error.message,
        }));
      } finally {
        setLoading(false);
      }
    });
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <ScreenTransition>
      <ScreenBackground title="Создать аккаунт" backIcon="close">
        <Container safeArea>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <RegisterForm form={form} />

            <Button
              title="Зарегестрироваться"
              variant="primary"
              size="large"
              loading={form.isSubmitting}
              disabled={form.isSubmitting}
              onPress={handleRegister}
              fullWidth
              style={styles.registerButton}
            />

            <View style={styles.loginLinkContainer}>
              <Typo variant="body2" align="center">
                Уже есть аккаунт?{' '}
                <Typo
                  variant="body2"
                  weight="bold"
                  style={styles.loginLink}
                  onPress={handleLoginPress}>
                  Войти
                </Typo>
              </Typo>
            </View>
          </ScrollView>
        </Container>
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  closeButtonContainer: {
    alignSelf: 'flex-start',
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  titleContainer: {
    marginVertical: SPACING.xl,
  },
  scrollContent: {
    flexGrow: 1,
  },
  registerButton: {
    marginTop: SPACING.xl,
  },
  loginLinkContainer: {
    marginTop: SPACING.xxl,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  loginLink: {
    color: '#7AB648',
  },
});

export default RegisterScreen;
