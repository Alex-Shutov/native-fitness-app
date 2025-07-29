import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSetRecoilState } from 'recoil';

import RegisterForm from './widgets/RegisterForm';
import Button from '../../shared/ui/button';
import Container from '../../shared/ui/layout/Container';
import ScreenTransition from '../../shared/ui/layout/ScreenTransition';
import {Typo}from '../../shared/ui/typo/typo';
import { authState } from '../auth/models/auth.atom';

import { useSnackbar } from '~/core/hooks/useSnackbar';
import useZodForm from '~/core/hooks/useZodForm';
import { SPACING } from '~/core/styles/theme';
import AuthService from '~/pages/auth/api/auth.service';
import useAuth from '~/pages/auth/lib/useAuth';
import { registerSchema } from '~/pages/auth/models/validate.auth';
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
  const { register, loading,error,setError } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleRegister = async () => {
    await form.handleSubmit(async (values) => {
      try {
        const x= await register({
          username: values.name,
          ...values,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'SelectGoals' }],
        });
      } catch (err) {

      }
    });
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <ScreenTransition>
        <ScreenBackground title="Создать аккаунт" backIcon="close">
          <Container fullScreen={true} safeArea>
            <View style={styles.mainContent}>
              <RegisterForm setError={setError} form={form} />

              <Button
                title="Зарегистрироваться"
                // variant="primary"
                // size="medium"
                loading={form.isSubmitting}
                disabled={form.isSubmitting}
                onPress={handleRegister}
                // fullWidth
                style={styles.registerButton}
              />
              {error && <Typo variant={'body1'} style={{color:'red',marginTop:SPACING.lg}}>{error}</Typo>}
            </View>

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
          </Container>
        </ScreenBackground>
      </ScreenTransition>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  closeButtonContainer: {
    alignSelf: 'flex-start',
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  mainContent: {
    flex: 1,
    flexGrow: 1,
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
    display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'center',
  },
  loginLink: {
    color: '#7AB648',
  },
});

export default RegisterScreen;
