import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRecoilState } from 'recoil';

import { COLORS, SPACING, BORDER_RADIUS, FONT_FAMILY } from '~/core/styles/theme';
import { Typo } from '~/shared/ui/typo';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Button from '~/shared/ui/button';
import InfoModal from '~/widgets/modal/InfoModal';
import { getHistory } from '~/pages/profile/api/measurements.api';
import ProfileApi from '~/pages/profile/api/profile.api';
import { authState } from '~/pages/auth/models/auth.atom';
import { useSnackbar } from '~/core/hooks/useSnackbar';
import { FONT_SIZES } from '../../../core/styles/theme';

const SectionContainer = ({ label, children, onOpen }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionContent}>
      <View style={styles.sectionHeader}>
        <Typo variant="body0" weight="bold" style={styles.sectionLabel}>
          {label}
        </Typo>
        {onOpen && (
          <TouchableOpacity onPress={onOpen} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <MaterialIcons name="help-outline" size={24} color={COLORS.neutral.dark} />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  </View>
);

const AddMeasurementsScreen = () => {
  const navigation = useNavigation();
  const [auth, setAuth] = useRecoilState(authState);
  const { showSnackbar } = useSnackbar();
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [visibleChest, setVisibleChest] = useState(false);
  const [visibleWaist, setVisibleWaist] = useState(false);
  const [visibleHips, setVisibleHips] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getHistory();
        const last = list[0];
        if (cancelled) return;
        if (last) {
          setChest(String(last.chestCircumference ?? ''));
          setWaist(String(last.waistCircumference ?? ''));
          setHips(String(last.hipCircumference ?? ''));
        } else {
          setChest(String(auth?.chestCircumference ?? ''));
          setWaist(String(auth?.waistCircumference ?? ''));
          setHips(String(auth?.hipCircumference ?? ''));
        }
      } catch (e) {
        if (!cancelled) {
          setChest(String(auth?.chestCircumference ?? ''));
          setWaist(String(auth?.waistCircumference ?? ''));
          setHips(String(auth?.hipCircumference ?? ''));
        }
      } finally {
        if (!cancelled) setFetching(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async () => {
    const chestNum = Number(chest);
    const waistNum = Number(waist);
    const hipsNum = Number(hips);
    if (Number.isNaN(chestNum) || Number.isNaN(waistNum) || Number.isNaN(hipsNum)) {
      showSnackbar('Введите числа во все поля', 'error');
      return;
    }

    setLoading(true);
    try {
      const updated = await ProfileApi.updateProfile({
        chestCircumference: chestNum,
        waistCircumference: waistNum,
        hipCircumference: hipsNum,
      });
      setAuth((prev) => ({ ...prev, ...updated }));
      showSnackbar('Измерения сохранены', 'success');
      navigation.goBack();
    } catch (e) {
      console.error('Update measurements:', e);
      showSnackbar('Ошибка сохранения', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <ScreenTransition>
        <ScreenBackground hasBackButton onBackPress={() => navigation.goBack()}>
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={COLORS.primary.main} />
          </View>
        </ScreenBackground>
      </ScreenTransition>
    );
  }

  return (
    <ScreenTransition>
      <ScreenBackground
        title="Добавить измерения"
        hasBackButton
        onBackPress={() => navigation.goBack()}
        titleStyle={styles.titleStyle}
        contentStyle={styles.content}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <SectionContainer label="Объем груди" onOpen={() => setVisibleChest(true)}>
            <View style={styles.parameterInputWrapper}>
              <View style={styles.inputContainer}>
                <TextInput
                  maxLength={3}
                  style={styles.parameterInput}
                  value={chest}
                  onChangeText={setChest}
                  keyboardType="numeric"
                  placeholder="--"
                  placeholderTextColor={COLORS.neutral.medium}
                />
              </View>
            </View>
          </SectionContainer>

          <SectionContainer label="Объем талии" onOpen={() => setVisibleWaist(true)}>
            <View style={styles.parameterInputWrapper}>
              <View style={styles.inputContainer}>
                <TextInput
                  maxLength={3}
                  style={styles.parameterInput}
                  value={waist}
                  onChangeText={setWaist}
                  keyboardType="numeric"
                  placeholder="--"
                  placeholderTextColor={COLORS.neutral.medium}
                />
              </View>
            </View>
          </SectionContainer>

          <SectionContainer label="Объем ягодиц" onOpen={() => setVisibleHips(true)}>
            <View style={styles.parameterInputWrapper}>
              <View style={styles.inputContainer}>
                <TextInput
                  maxLength={3}
                  style={styles.parameterInput}
                  value={hips}
                  onChangeText={setHips}
                  keyboardType="numeric"
                  placeholder="--"
                  placeholderTextColor={COLORS.neutral.medium}
                />
              </View>
            </View>
          </SectionContainer>

          <View style={styles.actions}>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary.main} />
            ) : (
              <Button title="Сохранить" onPress={handleSubmit} />
            )}
          </View>
        </ScrollView>

        <InfoModal
          image={require('~/shared/assets/images/chest.jpg')}
          text="Измеряйте объем груди на уровне подмышек и над грудью."
          visible={visibleChest}
          onClose={() => setVisibleChest(false)}
          title="Как измерять?"
        />
        <InfoModal
          image={require('~/shared/assets/images/waist.jpg')}
          text="Объем талии - наиболее узкая часть."
          visible={visibleWaist}
          onClose={() => setVisibleWaist(false)}
          title="Как измерять?"
        />
        <InfoModal
          image={require('~/shared/assets/images/hips.jpg')}
          text="Измеряйте объем ягодиц следующим образом: нужно стоять ровно. Ленту на более выступающие места."
          visible={visibleHips}
          onClose={() => setVisibleHips(false)}
          title="Как измерять?"
        />
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.md,
  },
  scroll: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: SPACING.md,
  },
  titleStyle: {
    fontFamily: FONT_FAMILY.accent.regular,
    fontSize: FONT_SIZES.xxl
  },
  sectionContent: {
    width: '100%',
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    paddingTop: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    minWidth: '90%',
    textAlign: 'left',
    color: COLORS.primary.extraDark,
    fontSize: SPACING.md,
    flex: 1,
  },
  parameterInputWrapper: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    marginTop: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary.extraLight,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 48,
  },
  parameterInput: {
    flex: 1,
    fontFamily: FONT_FAMILY?.text?.bold,
    fontSize: SPACING.md * 1.2,
    color: COLORS.primary.dark,
    fontWeight: '900',
    padding: 0,
    margin: 0,
  },
  actions: {
    marginTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
});

export default AddMeasurementsScreen;
