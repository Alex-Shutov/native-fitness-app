import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSetRecoilState } from 'recoil';
import { authState } from '~/pages/auth/models/auth.atom';
import useZodForm from '~/core/hooks/useZodForm';
import {emailSchema,phoneSchema} from './models/validate.auth'
import { SPACING } from '~/core/styles/theme';
import { View,StyleSheet } from 'react-native';
import Typo from '~/shared/ui/typo';
import Button from '~/shared/ui/button';
import Input from '~/shared/ui/input/input';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import Container from '~/shared/ui/layout/Container';
import Toggle from '~/shared/ui/toogle';

const LoginScreen = () => {
  const navigation = useNavigation();
  const setAuthState = useSetRecoilState(authState);
  const [loginMethod, setLoginMethod] = useState(0);

  const emailForm = useZodForm(emailSchema, {
    email: '',
    password: '',
  });

  const phoneForm = useZodForm(phoneSchema, {
    phone: '',
    password: '',
  });

  const activeForm = loginMethod === 0 ? emailForm : phoneForm;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    const currentForm = loginMethod === 0 ? emailForm : phoneForm;

    await currentForm.handleSubmit(async (values) => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate API call

        console.log('Logging in with:', values);

        // Create user object for auth state
        const userData = {
          name: 'User', // Placeholder since we don't ask for name during login
          email: loginMethod === 0 ? values.email : '',
          phone: loginMethod === 1 ? values.phone : '',
        };

        setAuthState(getUserValue(userData));

        // Navigate to the main app
        navigation.navigate('Start'); // or wherever you want to go after login
      } catch (error) {
        console.error('Login error:', error);

        setAuthState((prev) => ({
          ...prev,
          error: 'Login failed: ' + error.message,
        }));
      } finally {
        setLoading(false);
      }
    });
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };


  return (
    <ScreenTransition>
      <ScreenBackground title="Войти в аккаунт" backIcon="close">
        <Container safeArea>
          <View style={styles.mainContent}>
            {/* Login method toggle */}
            <Toggle
              options={['Почта', 'Телефон']}
              selectedIndex={loginMethod}
              onSelect={setLoginMethod}
              style={styles.toggle}
            />

            {/* Login form */}
            <View style={styles.formContainer}>
              {/* Email or phone input based on selected method */}
              {loginMethod === 0 ? (
                <Input
                  icon="email"
                  placeholder="Электронная почта"
                  value={emailForm.values.email}
                  onChangeText={(text) => emailForm.handleChange('email', text)}
                  onBlur={() => emailForm.handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={emailForm.errors.email}
                />
              ) : (
                <Input
                  icon="phone"
                  placeholder="Номер телефона"
                  value={phoneForm.values.phone}
                  onChangeText={(text) => phoneForm.handleChange('phone', text)}
                  onBlur={() => phoneForm.handleBlur('phone')}
                  keyboardType="phone-pad"
                  error={phoneForm.errors.phone}
                />
              )}

              {/* Password input for both methods */}
              <Input
                icon="lock"
                placeholder="Пароль"
                value={loginMethod === 0 ? emailForm.values.password : phoneForm.values.password}
                onChangeText={(text) => {
                  loginMethod === 0
                    ? emailForm.handleChange('password', text)
                    : phoneForm.handleChange('password', text);
                }}
                onBlur={() => {
                  loginMethod === 0
                    ? emailForm.handleBlur('password')
                    : phoneForm.handleBlur('password');
                }}
                secureTextEntry={!passwordVisible}
                rightIcon="eye"
                onRightIconPress={togglePasswordVisibility}
                error={
                  loginMethod === 0
                    ? emailForm.errors.password
                    : phoneForm.errors.password
                }
                style={styles.passwordInput}
              />
            </View>

            {/*<Typo*/}
            {/*  variant="body2"*/}
            {/*  align="right"*/}
            {/*  style={styles.forgotPassword}*/}
            {/*  onPress={() => navigation.navigate('ForgotPassword')}*/}
            {/*>*/}
            {/*  Нет аккаунта?*/}
            {/*  <Typo>Зарегистрироваться</Typo>*/}
            {/*</Typo>*/}
            <View style={styles.fake}></View>

            <Button
              title="Войти"
              variant="primary"
              loading={loading}
              disabled={loading}
              onPress={handleLogin}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.registerLinkContainer}>
            <Typo variant="body2" align="center">
              Нет аккаунта?{' '}
              <Typo
                variant="body2"
                weight="bold"
                style={styles.registerLink}
                onPress={handleRegisterPress}>
                Зарегистрироваться
              </Typo>
            </Typo>
          </View>
        </Container>
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
  },
  toggle: {
    marginBottom: SPACING.md,
  },
  formContainer: {
    width: '100%',
    gap: SPACING.sm,
  },
  passwordInput: {
  },
  forgotPassword: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    color: '#7AB648',
  },
  loginButton: {
    display: 'flex',
    alignSelf:'center',
    marginTop: SPACING.md,
  },
  registerLinkContainer: {
    marginTop: SPACING.xl,
  },
  registerLink: {
    color: '#7AB648',
  },
  fake:{
    flex:0.7
  }
});

export default LoginScreen;