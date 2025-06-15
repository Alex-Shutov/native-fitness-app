import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSetRecoilState } from 'recoil';

import RegisterForm from './widgets/RegisterForm';
import Button from '../../shared/ui/button';
import Container from '../../shared/ui/layout/Container';
import ScreenTransition from '../../shared/ui/layout/ScreenTransition';
import Typo from '../../shared/ui/typo';
import { authState } from '../auth/models/auth.atom';

import useZodForm from '~/core/hooks/useZodForm';
import { SPACING } from '~/core/styles/theme';
import { registerSchema } from '~/pages/auth/models/validate.auth';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import { useSnackbar } from '~/core/hooks/useSnackbar';
import AuthService from '~/pages/auth/api/auth.service';
import useAuth from '~/pages/auth/lib/useAuth';

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
  const {register,loading} = useAuth()
  const { showSnackbar } = useSnackbar();

  const handleRegister = async () => {
    await form.handleSubmit(async (values) => {
      try {
        await register({
          username: values.name,
          ...values,
        });

        navigation.reset({
          index: 0,
          routes: [{ name: "SelectGoals" }],
        })
      } catch (err) {
        if (err.response?.status === 409) {
          showSnackbar("Username or email already exists", 'error');
        } else {
          showSnackbar(err.response?.data || "Registration failed. Please try again.", 'error')
        }
      }
    })
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <ScreenTransition>
      <ScreenBackground title="Создать аккаунт" backIcon="close">
        <Container safeArea>
          {/*<ScrollView*/}
          {/*  contentContainerStyle={styles.scrollContent}*/}
          {/*  showsVerticalScrollIndicator={false}>*/}
          <View style={styles.mainContent}>
            <RegisterForm form={form} />

            <Button
              title="Зарегестрироваться"
              // variant="primary"
              // size="medium"
              loading={form.isSubmitting}
              disabled={form.isSubmitting}
              onPress={handleRegister}
              // fullWidth
              style={styles.registerButton}
            />
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
          {/*</ScrollView>*/}
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
    // flexDirection: 'row',
    // justifyContent: 'center',
  },
  loginLink: {
    color: '#7AB648',
  },
});

export default RegisterScreen;
