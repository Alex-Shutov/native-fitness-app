import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import AgreementSection from './AgreementSection';
import { SPACING } from '../../../core/styles/theme';


import Input from '~/shared/ui/input/input';

const RegisterForm = ({form}) => {
  const { values, errors, handleChange, handleBlur } = form;
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  return (
    <View style={styles.formContainer}>
      <Input
        icon="person"
        placeholder="Ваше имя"
        value={values.name}
        onChangeText={(text) => handleChange('name', text)}
        onBlur={() => handleBlur('name')}
        autoCapitalize="words"
        error={errors.name}
      />

      <Input
        icon="email"
        placeholder="Электронная почта"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        onBlur={() => handleBlur('email')}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}

      />

      <Input
        icon="phone"
        placeholder="Номер телефона"
        value={values.phone}
        onChangeText={(text) => handleChange('phone', text)}
        onBlur={() => handleBlur('phone')}
        keyboardType="phone-pad"
        error={errors.phone}
      />

      <Input
        icon="lock"
        placeholder="Пароль"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        onBlur={() => handleBlur('password')}
        secureTextEntry={!passwordVisible}
        rightIcon="eye"
        onRightIconPress={togglePasswordVisibility}
        error={errors.password}
      />

      <AgreementSection
        checked={values.agreementAccepted}
        onCheckboxChange={(value) => handleChange('agreementAccepted', value)}
        error={errors.agreementAccepted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    gap: SPACING.md,
  },
});

export default RegisterForm;
