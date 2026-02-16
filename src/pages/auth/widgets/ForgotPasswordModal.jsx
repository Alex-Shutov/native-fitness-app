import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, StyleSheet, Animated, TouchableOpacity } from 'react-native';

import { BORDER_RADIUS, COLORS, SPACING } from '~/core/styles/theme';
import AuthService from '~/pages/auth/api/auth.service';
import Button from '~/shared/ui/button';
import Input from '~/shared/ui/input/input';
import { Typo } from '~/shared/ui/typo';
import { validateEmail, validatePassword } from '~/shared/lib/validate';
import { FONT_SIZES } from '../../../core/styles/theme';
import CrossIcon from '~/shared/ui/icons/CrossIcon';

const ForgotPasswordModal = ({ visible, onClose }) => {
  const [step, setStep] = useState('email'); // email | info | code | password
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(null);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [loading, setLoading] = useState(false);

  const passwordAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step === 'password') {
      passwordAnim.setValue(0);
      Animated.timing(passwordAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [step, passwordAnim]);

  const resetState = () => {
    setStep('email');
    setEmail('');
    setEmailError(null);
    setCode('');
    setCodeError(null);
    setIsCodeValid(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose?.();
  };

  const handleSendEmail = async () => {
    if (!validateEmail(email)) {
      setEmailError('Введите корректный email');
      return;
    }
    setEmailError(null);
    setLoading(true);
    try {
      await AuthService.forgotPassword(email);
      setStep('info');
    } catch (err) {
      setEmailError('Не удалось отправить код. Попробуйте ещё раз');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = async (value) => {
    if (codeError) setCodeError(null);
    setCode(value.replace(/[^0-9]/g, '').slice(0, 6));
    const cleaned = value.replace(/[^0-9]/g, '').slice(0, 6);
    if (cleaned.length === 6) {
      setLoading(true);
      try {
        const res = await AuthService.validateResetCode(cleaned);
        if (res?.valid) {
          setIsCodeValid(true);
          setStep('password');
        } else {
          setCodeError(res?.message || 'Код недействителен');
        }
      } catch (e) {
        setCodeError('Ошибка проверки кода');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword(newPassword)) {
      setPasswordError('Пароль должен содержать не менее 6 символов');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    setPasswordError(null);
    setLoading(true);
    try {
      await AuthService.resetPassword({
        token: code,
        newPassword,
        confirmPassword,
      });
      handleClose();
    } catch (e) {
      setPasswordError('Не удалось сменить пароль. Попробуйте ещё раз');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (step === 'email') {
      return (
        <>
          <Typo variant="hSub" style={styles.title}>
            Восстановление пароля
          </Typo>
          <Typo variant="body2" style={styles.text}>
            Введите email, к которому привязан аккаунт. Мы отправим на него 6-значный код.
          </Typo>
          <Input
            icon="email"
            placeholder="Email"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(val) => {
              if (emailError) setEmailError(null);
              setEmail(val);
            }}
            error={emailError}
          />
          <Button
            title="Отправить код"
            onPress={handleSendEmail}
            style={styles.button}
            loading={loading}
            disabled={loading}
          />
        </>
      );
    }

    if (step === 'info') {
      return (
        <>
          <Typo variant="hSub" style={styles.title}>
            Код отправлен
          </Typo>
          <Typo variant="body2" style={styles.text}>
            На указанную почту мы отправили код для восстановления пароля.{'\n'}
            Введите его на следующем шаге.
          </Typo>
          <Button
            title="Далее"
            onPress={() => setStep('code')}
            style={styles.button}
          />
        </>
      );
    }

    if (step === 'code') {
      return (
        <>
          <Typo variant="hSub" style={styles.title}>
            Введите код
          </Typo>
          <Typo variant="body2" style={styles.text}>
            Введите 6-значный код, который мы отправили на вашу почту.
          </Typo>
          <Input
            icon="pin"
            placeholder="Код из письма"
            value={code}
            keyboardType="number-pad"
            onChangeText={handleCodeChange}
            maxLength={6}
            error={codeError}
          />
          <Button
            title="Продолжить"
            onPress={() => {
              if (code.length === 6 && !isCodeValid && !loading) {
                handleCodeChange(code);
              }
            }}
            style={styles.button}
            loading={loading}
            disabled={loading}
          />
        </>
      );
    }

    return (
      <Animated.View
        style={{
          opacity: passwordAnim,
          transform: [
            {
              translateY: passwordAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}>
        <Typo variant="hSub" style={styles.title}>
          Новый пароль
        </Typo>
        <Typo variant="body2" style={styles.text}>
          Придумайте новый пароль и подтвердите его.
        </Typo>
        <Input
          icon="lock"
          placeholder="Новый пароль"
          value={newPassword}
          secureTextEntry
          onChangeText={(val) => {
            if (passwordError) setPasswordError(null);
            setNewPassword(val);
          }}
        />
        <Input
          icon="lock"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          secureTextEntry
          onChangeText={(val) => {
            if (passwordError) setPasswordError(null);
            setConfirmPassword(val);
          }}
          error={passwordError}
        />
        <Button
          title="Сменить пароль"
          onPress={handleResetPassword}
          style={styles.button}
          loading={loading}
          disabled={loading}
        />
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.closeRow}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <CrossIcon size={24} />
            </TouchableOpacity>
          </View>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  closeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  text: {
    textAlign: 'left',
    marginBottom: SPACING.md,
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default ForgotPasswordModal;

