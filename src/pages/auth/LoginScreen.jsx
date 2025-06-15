import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSetRecoilState } from 'recoil';
import { authState } from '~/pages/auth/models/auth.atom';
import useZodForm from '~/core/hooks/useZodForm';
import { emailSchema, phoneSchema, usernameSchema } from './models/validate.auth';
import { SPACING } from '~/core/styles/theme';
import { View,StyleSheet } from 'react-native';
import Typo from '~/shared/ui/typo';
import Button from '~/shared/ui/button';
import Input from '~/shared/ui/input/input';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import Container from '~/shared/ui/layout/Container';
import Toggle from '~/shared/ui/toogle';
import { getUserValue } from '~/pages/auth/lib/auth';
import AuthService from '~/pages/auth/api/auth.service';
import useAuth from '~/pages/auth/lib/useAuth';

const LoginScreen = () => {
  const navigation = useNavigation();
  const setAuthState = useSetRecoilState(authState);
  const [loginMethod, setLoginMethod] = useState(0);

  const emailForm = useZodForm(usernameSchema, {
    username: '',
    password: '',
  });

  const phoneForm = useZodForm(phoneSchema, {
    phone: '',
    password: '',
  });

  const activeForm = loginMethod === 0 ? emailForm : phoneForm;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {login,loading} = useAuth()

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    const currentForm = loginMethod === 0 ? emailForm : phoneForm;

    await currentForm.handleSubmit(async (values) => {
      try {
        await login(values);
        // const userData = await AuthService.login(values)
        //
        // console.log('Logging in with:', values);
        //
        // // Create user object for auth state
        //
        //
        // setAuthState(getUserValue(userData));

        navigation.reset({
          index: 0,
          routes: [{ name: "MainScreen" }],
        })
      } catch (error) {
        console.error('Login error:', error);

        setAuthState((prev) => ({
          ...prev,
          error: 'Login failed: ' + error.message,
        }));
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
              options={['Имя пользователя', 'Телефон']}
              selectedIndex={loginMethod}
              onSelect={setLoginMethod}
              style={styles.toggle}
            />

            {/* Login form */}
            <View style={styles.formContainer}>
              {/* Email or phone input based on selected method */}
              {loginMethod === 0 ? (
                <Input
                  icon="person"
                  placeholder="Имя пользователя"
                  value={emailForm.values.username}
                  onChangeText={(text) => emailForm.handleChange('username', text)}
                  onBlur={() => emailForm.handleBlur('username')}
                  // keyboardType=""
                  autoCapitalize="none"
                  error={emailForm.errors.username}
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