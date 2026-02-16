import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRecoilState } from 'recoil';

import SliderInputV2 from '../../shared/ui/slider';
import InfoModal from '../../widgets/modal/InfoModal';
import { trackerVersion } from '../tracker/state/tracker.state';

import { COLORS, SPACING, BORDER_RADIUS, FONT_FAMILY, FONT_SIZES } from '~/core/styles/theme';
import { authState } from '~/pages/auth/models/auth.atom';
import Button from '~/shared/ui/button';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import { Typo } from '~/shared/ui/typo';

const { width } = Dimensions.get('window');

const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const [auth, setAuth] = useRecoilState(authState);
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Состояния для полей формы
  const [gender, setGender] = useState(auth?.gender || 'male');
  const [age, setAge] = useState(auth?.age || 24);
  const [height, setHeight] = useState(auth?.height || 175);
  const [weight, setWeight] = useState(auth?.weight || 60);
  const [targetWeight, setTargetWeight] = useState(auth?.targetWeight || 55);
  const [chestCircumference, setChestCircumference] = useState(auth?.chestCircumference || '');
  const [waistCircumference, setWaistCircumference] = useState(auth?.waistCircumference || '');
  const [hipCircumference, setHipCircumference] = useState(auth?.hipCircumference || '');
  const [visibleChest, setVisibleChest] = useState(false);
  const [visibleWaist, setVisibleWaist] = useState(false);
  const [visibleHips, setVisibleHips] = useState(false);
  const calculateBodyMassIndex = () => {
    if (!height || !weight) return '--';
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    return bmi;
  };

  const handleOpenChest = () => {
    setTimeout(() => setVisibleChest(true), 50);
  };

  const handleCloseChest = () => {
    setTimeout(() => setVisibleChest(false), 50);
  };

  const handleOpenWaist = () => {
    setTimeout(() => setVisibleWaist(true), 50);
  };

  const handleCloseWaist = () => {
    setTimeout(() => setVisibleWaist(false), 50);
  };

  const handleOpenHips = () => {
    setTimeout(() => setVisibleHips(true), 50);
  };

  const handleCloseHips = () => {
    setTimeout(() => setVisibleHips(false), 50);
  };

  const [bmi, setBmi] = useState(auth.bodyMassIndex);

  // Состояние для раскрывающихся секций
  const [expandedSections, setExpandedSections] = useState({
    program: true,
    nutrition: false,
    results: false,
  });

  useEffect(() => {
    setBmi(calculateBodyMassIndex());
  }, [weight, height]);

  // Функция для переключения раскрытия секции
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Возвращаем текущие значения обхватов
  const calculateCircumferences = () => {
    return {
      chest: chestCircumference,
      waist: waistCircumference,
      hip: hipCircumference,
    };
  };

  // Переход на следующую страницу
  const goToNextPage = () => {
    if (currentPage === 0) {
      scrollViewRef.current?.scrollTo({ x: width, animated: true });
      setCurrentPage(1);
    }
  };

  // Обработчик свайпа
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const page = Math.round(scrollPosition / width);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleContinue = () => {
    const bmi = calculateBodyMassIndex();

    setAuth((prevState) => ({
      ...prevState,
      gender,
      age,
      height,
      weight,
      targetWeight,
      chestCircumference,
      waistCircumference,
      hipCircumference,
      bodyMassIndex: bmi,
    }));
    navigation.navigate('DietSelectionScreen');
  };

  return (
    <ScreenTransition>
      <ScreenBackground>
        <ScrollView ref={scrollViewRef}>
          {/* Первая страница - Ввод основных параметров */}
          <View style={[styles.page]}>
            <View style={styles.headerContainer}>
              <Typo variant="hSub" style={styles.header}>
                Расскажи о себе
              </Typo>
            </View>

            {/* Выбор пола */}
            <SectionContainer label="Пол">
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[styles.genderOption, gender === 'male' && styles.selectedGender]}
                  onPress={() => setGender('male')}>
                  <MaterialIcons
                    name="male"
                    size={48}
                    color={gender === 'male' ? COLORS.primary.main : COLORS.neutral.medium}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.genderOption, gender === 'female' && styles.selectedGender]}
                  onPress={() => setGender('female')}>
                  <MaterialIcons
                    name="female"
                    size={48}
                    color={gender === 'female' ? COLORS.primary.main : COLORS.neutral.medium}
                  />
                </TouchableOpacity>
              </View>
            </SectionContainer>

            {/* Ввод возраста */}
            <SectionContainer label="Возраст">
              <SliderInputV2
                value={age}
                onValueChange={setAge}
                minimumValue={18}
                maximumValue={100}
                step={1}
              />
            </SectionContainer>

            {/* Ввод роста */}
            <SectionContainer label="Рост">
              <SliderInputV2
                value={height}
                onValueChange={setHeight}
                minimumValue={100}
                maximumValue={220}
                step={1}
              />
            </SectionContainer>

            {/* Ввод веса */}
            <SectionContainer label="Вес">
              <SliderInputV2
                value={weight}
                onValueChange={setWeight}
                minimumValue={30}
                maximumValue={200}
                step={1}
              />
            </SectionContainer>

            {/* Ввод параметров */}
            <SectionContainer label="Объем груди" onOpen={handleOpenChest}>
              <View style={styles.parametersInputContainer}>
                <View style={styles.parameterInputWrapper}>
                  {/*<Typo*/}

                  {/*  variant="caption"*/}
                  {/*  color={COLORS.neutral.medium}*/}
                  {/*  style={styles.parameterLabel}>*/}
                  {/*  Объем груди*/}
                  {/*</Typo>*/}
                  <View style={styles.inputContainer}>
                    <TextInput
                      maxLength={3}
                      style={styles.parameterInput}
                      value={chestCircumference}
                      onChangeText={setChestCircumference}
                      keyboardType="numeric"
                      placeholder="--"
                      placeholderTextColor={COLORS.neutral.medium}
                    />
                    {/*<Typo variant="body1" style={styles.inputUnit}>см</Typo>*/}
                  </View>
                </View>

                {/*<View style={styles.parameterInputWrapper}>*/}
                {/*  <Typo*/}
                {/*    variant="caption"*/}
                {/*    color={COLORS.neutral.medium}*/}
                {/*    style={styles.parameterLabel}>*/}
                {/*    Объем талии*/}
                {/*  </Typo>*/}
                {/*  <View style={styles.inputContainer}>*/}
                {/*    <TextInput*/}
                {/*      maxLength={3}*/}
                {/*      style={styles.parameterInput}*/}
                {/*      value={waistCircumference}*/}
                {/*      onChangeText={setWaistCircumference}*/}
                {/*      keyboardType="numeric"*/}
                {/*      placeholder="--"*/}
                {/*      placeholderTextColor={COLORS.neutral.medium}*/}
                {/*    />*/}
                {/*    /!*<Typo variant="body1" style={styles.inputUnit}>см</Typo>*!/*/}
                {/*  </View>*/}
                {/*</View>*/}

                {/*<View style={styles.parameterInputWrapper}>*/}
                {/*  <Typo*/}
                {/*    variant="caption"*/}
                {/*    color={COLORS.neutral.medium}*/}
                {/*    style={styles.parameterLabel}>*/}
                {/*    Объем бедер*/}
                {/*  </Typo>*/}
                {/*  <View style={styles.inputContainer}>*/}
                {/*    <TextInput*/}
                {/*      maxLength={3}*/}
                {/*      style={styles.parameterInput}*/}
                {/*      value={hipCircumference}*/}
                {/*      onChangeText={setHipCircumference}*/}
                {/*      keyboardType="numeric"*/}
                {/*      placeholder="--"*/}
                {/*      placeholderTextColor={COLORS.neutral.medium}*/}
                {/*    />*/}
                {/*    /!*<Typo variant="body1" style={styles.inputUnit}>см</Typo>*!/*/}
                {/*  </View>*/}
                {/*</View>*/}
              </View>
            </SectionContainer>

            <SectionContainer label="Объем талии" onOpen={handleOpenWaist}>
              {/**/}

              <View style={styles.parameterInputWrapper}>
                <View style={styles.inputContainer}>
                  <TextInput
                    maxLength={3}
                    style={styles.parameterInput}
                    value={waistCircumference}
                    onChangeText={setWaistCircumference}
                    keyboardType="numeric"
                    placeholder="--"
                    placeholderTextColor={COLORS.neutral.medium}
                  />
                </View>
              </View>
            </SectionContainer>

            <SectionContainer label="Объем ягодиц" onOpen={handleOpenHips}>
              <View style={styles.parameterInputWrapper}>
                <View style={styles.inputContainer}>
                  <TextInput
                    maxLength={3}
                    style={styles.parameterInput}
                    value={hipCircumference}
                    onChangeText={setHipCircumference}
                    keyboardType="numeric"
                    placeholder="--"
                    placeholderTextColor={COLORS.neutral.medium}
                  />
                  {/*<Typo variant="body1" style={styles.inputUnit}>см</Typo>*/}
                </View>
              </View>
            </SectionContainer>

            {/*<View style={styles.buttonContainer}>*/}
            {/*  <Button*/}
            {/*    title="Иду к цели"*/}
            {/*    style={styles.button}*/}
            {/*    loading={false}*/}
            {/*    onPress={handleContinue}*/}
            {/*  />*/}
            {/*</View>*/}
          </View>

          {/* Вторая страница - Желаемый вес и параметры */}
          <View style={[styles.page]}>
            {/*<View style={styles.headerContainer}>*/}
            {/*  <Typo variant="body0" style={styles.subHeader}>*/}
            {/*    Параметры*/}
            {/*  </Typo>*/}
            {/*</View>*/}

            {/* Отображение параметров */}
            {/*<View style={styles.parametersBoxContainer}>*/}
            {/*  <View style={styles.parametersContainer}>*/}
            {/*    <ParameterBox*/}
            {/*      label="Объем груди"*/}
            {/*      value={chestCircumference}*/}
            {/*    />*/}
            {/*    <ParameterBox*/}
            {/*      label="Объем талии"*/}
            {/*      value={waistCircumference}*/}
            {/*    />*/}
            {/*    <ParameterBox*/}
            {/*      label="Объем бедер"*/}
            {/*      value={hipCircumference}*/}
            {/*    />*/}
            {/*  </View>*/}
            {/*</View>*/}

            {/* Индекс массы тела */}
            <SectionContainer label="Индекс массы тела">
              <View style={styles.bmiValueContainer}>
                <Typo variant="h3" weight="bold" color={COLORS.primary.main}>
                  {calculateBodyMassIndex()}
                </Typo>
              </View>
            </SectionContainer>

            {/* Желаемый вес */}
            <SectionContainer label="Желаемый вес">
              <SliderInputV2
                value={targetWeight}
                onValueChange={setTargetWeight}
                minimumValue={30}
                maximumValue={150}
                step={1}
              />
            </SectionContainer>

            {/* Информационные секции */}




            <AccordionSection
              title="О программе"
              isExpanded={expandedSections.results}
              onToggle={() => toggleSection('results')}
              content="Программа нацелена на достижение желаемого веса через вырабатывание полезных привычек, которые помогают держать жизненный темп в тонусе. Программа прекрасно сочетается с занятиями спортом, не мешает рабочим процессам и не занимает много времени каждый день."
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Иду к цели"
                style={styles.button}
                loading={false}
                onPress={handleContinue}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.container}>
          <InfoModal
            image={require('../../shared/assets/images/chest.jpg')}
            text="Измеряйте объем груди на уровне подмышек и над грудью."
            visible={visibleChest}
            onClose={handleCloseChest}
            title="Как измерять?"
          />
          <InfoModal
            image={require('../../shared/assets/images/waist.jpg')}
            text="Объем талии - наиболее узкая часть."
            visible={visibleWaist}
            onClose={handleCloseWaist}
            title="Как измерять?"
          />
          <InfoModal
            image={require('../../shared/assets/images/hips.jpg')}
            text="Измеряйте объем ягодиц следующим образом: нужно стоять ровно. Ленту на более выступающие места."
            visible={visibleHips}
            onClose={handleCloseHips}
            title="Как измерять?"
          />
        </View>
      </ScreenBackground>
    </ScreenTransition>
  );
};

// Компонент для секции с белым фоном и лейблом в левом верхнем углу
const SectionContainer = ({ label, children, onOpen }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionContent}>
        <View style={styles.sectionHeader}>
          <Typo variant="body0" weight="bold" style={styles.sectionLabel}>
            {label}
          </Typo>
          {onOpen && (
            <TouchableWithoutFeedback style={styles.sectionButton} onPress={onOpen}>
              <MaterialIcons name="help-outline" size={24} color={COLORS.neutral.dark} />
            </TouchableWithoutFeedback>
          )}
        </View>
        {children}
      </View>
    </View>
  );
};

// Компонент для отображения параметра в коробке
const ParameterBox = ({ label, value }) => {
  return (
    <View style={styles.parameterBox}>
      <Typo variant="caption" color={COLORS.neutral.medium}>
        {label}
      </Typo>
      <View style={styles.parameterValue}>
        <Typo variant="body1" weight="bold">
          {value}
        </Typo>
      </View>
    </View>
  );
};

// Компонент аккордеона для информационных секций
const AccordionSection = ({ title, isExpanded, onToggle, content }) => {
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onToggle}>
        <Typo variant="body1" weight="medium">
          {title}
        </Typo>
        <View style={styles.accordionIcon}>
          {isExpanded ? (
            <MaterialIcons name="keyboard-arrow-up" size={24} color={COLORS.neutral.medium} />
          ) : (
            <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.neutral.medium} />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && content && (
        <View style={styles.accordionContent}>
          <Typo variant="body2" color={COLORS.neutral.medium}>
            {content}
          </Typo>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  headerContainer: {
    marginBottom: SPACING.md,
  },
  header: {
    fontSize: SPACING.xl * 1.4,
    lineHeight: SPACING.xl * 1.4,
  },
  subHeader: {
    fontSize: SPACING.xl,
    lineHeight: SPACING.xl * 1.2,
  },
  sectionContainer: {
    marginBottom: SPACING.md,
  },

  sectionContent: {
    width: '100%',

    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    paddingTop: SPACING.sm,
    position: 'relative',
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
  helpButton: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.md,
  },
  genderOption: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
  },
  selectedGender: {
    backgroundColor: COLORS.neutral.offWhite,
    borderWidth: 2,
    borderColor: COLORS.primary.main,
  },
  // Стили для нового слайдера (версия 2)
  sliderContainerV2: {
    // marginVertical: SPACING.md,
    paddingTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  sliderValueContainer: {
    marginBottom: SPACING.xs,
  },
  sliderValue: {
    lineHeight: 24,
    textAlign: 'start',
    fontSize: SPACING.md,
    color: COLORS.primary.dark,
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary.main,
    top: -8,
    marginLeft: -12,
    zIndex: 2,
  },
  sliderTrackV2: {
    height: 8,
    backgroundColor: COLORS.neutral.light,
    borderRadius: BORDER_RADIUS.full,
    position: 'relative',
  },
  sliderFillV2: {
    height: '100%',
    backgroundColor: COLORS.primary.main,
    borderRadius: BORDER_RADIUS.full,
  },

  sliderTriangle: {
    position: 'absolute',
    bottom: -16,
    marginLeft: -10,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.primary.main,
  },
  parametersBoxContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  parameterValue: {
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primary.extraLight,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  parametersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  parameterBox: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bmiContainer: {
    marginBottom: SPACING.lg,
  },
  bmiHeader: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  bmiValueContainer: {
    backgroundColor: COLORS.primary.extraLight,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  accordionContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  accordionIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordionContent: {
    padding: SPACING.md,
    paddingTop: 0,
    textAlign: 'start',
    // borderTopWidth: 1,
    borderTopColor: COLORS.neutral.light,
  },
  parametersInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  parameterInputWrapper: {
    flex: 1,
    marginHorizontal: SPACING.xs,
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
    // flex: 1,
    fontFamily: FONT_FAMILY.text.bold,
    fontSize: SPACING.md * 1.2,
    color: COLORS.primary.dark,
    fontWeight: 900,
    padding: 0,
    margin: 0,
  },
  inputUnit: {
    color: COLORS.neutral.medium,
    marginLeft: SPACING.xs,
  },
  parameterLabel: {
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  button: {
    width: '100%',
    alignSelf: 'center',
  },
});

export default PersonalInfoScreen;
