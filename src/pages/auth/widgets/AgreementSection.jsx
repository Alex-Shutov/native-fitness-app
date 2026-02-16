import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';

import Theme, { COLORS, SPACING } from '../../../core/styles/theme';
import { Typo } from '../../../shared/ui/typo/typo';

const POLICY_URL = 'https://stroynaya.online/static/Политика_обработки_данных.pdf';
const CONSENT_URL = 'https://stroynaya.online/static/Согласие_на_обработку_данных.pdf';

const AgreementSection = ({ checked, onCheckboxChange }) => {
  const openPolicy = () => Linking.openURL(POLICY_URL);
  const openConsent = () => Linking.openURL(CONSENT_URL);

  return (
    <View style={styles.container}>
      <View style={styles.agreementTextContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} persistentScrollbar>
          <Typo>Предупреждение</Typo>
          <Typo style={{ textAlign: 'justify' }} variant="body2" color={COLORS.neutral.medium}>
            Обратите внимание: предлагаемая программа по достижению желаемого веса может оказаться неэффективной в следующих случаях.

            {'\n\n'}Употребление антибиотиков{'\n'}
            Антибиотики, являясь важнейшими средствами лечения бактериальных инфекций, тем не менее, могут негативно влиять на процесс похудения. Установлено, что даже непродолжительное применение антибиотиков существенно изменяет состав кишечной микрофлоры, что приводит к нарушению метаболических процессов и, как следствие, затрудняет снижение веса. Кроме того, длительный прием антибиотиков повышает риск развития инсулинорезистентности, что также негативно сказывается на процессе похудения.

            {'\n\n'}Приём антидепрессантов{'\n'}
            Антидепрессанты, несмотря на их ключевую роль в лечении депрессии и тревожных расстройств, могут существенно затруднять процесс похудения. Исследования показывают, что набор веса при приёме антидепрессантов может быть связан с несколькими факторами: изменением уровня серотонина, влияющим на пищевое поведение, замедлением метаболизма и понижением чувствительности тканей к инсулину. Особенно выраженный негативный эффект наблюдается в первые месяцы терапии, когда риск увеличения веса наиболее высок.

            {'\n\n'}Нарушения сна{'\n'}
            Недостаток сна приводит к нарушению баланса гормонов грелина и лептина, что вызывает повышение аппетита и снижение чувства насыщения. При регулярном недосыпе происходит замедление метаболизма и формирование положительного энергетического баланса (когда человек потребляет больше калорий, чем тратит), что в совокупности способствует набору веса. Нерегулярный режим сна, нарушающий циркадные ритмы организма, также приводит к повышению потребления калорий и накоплению жировых отложений, особенно в области живота.

            {'\n\n'}Нарушение баланса между работой и личной жизнью{'\n'}
            Хронический стресс, вызванный переработками и недостатком времени на отдых, приводит к повышению уровня кортизола, что провоцирует тягу к высококалорийной пище и накопление жировых отложений. Кроме того, постоянный цейтнот вынуждает людей выбирать быстрые перекусы вместо полноценных приемов пищи, что нарушает режим питания и ведет к перееданию. В результате формируется замкнутый круг: недостаток времени на физическую активность и нездоровое питание еще больше усиливают стресс и нарушают гормональный баланс, что существенно затрудняет контроль веса и поддержание здорового образа жизни.

            {'\n\n'}Убедитесь, что у вас не имеется препятствий, которые могут снизить эффективность и результативность предлагаемой программы. Если они все же есть, запишитесь на дополнительную консультацию к специалисту.
          </Typo>
        </ScrollView>
      </View>

      <View style={styles.checkboxRow}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onCheckboxChange(!checked)}
          activeOpacity={0.7}>
          <View style={[styles.checkbox, checked && styles.checkboxSelected]}>
            {checked && <MaterialIcons name="check" size={16} color={COLORS.neutral.white} />}
          </View>
          <Typo variant="body2" style={styles.checkboxLabel}>
            Согласен с обработкой персональных{' '}
            <Typo variant="body2" style={styles.link} onPress={openConsent}>
              данных (соглашение)
            </Typo>
            {' '}согласно{' '}
            <Typo variant="body2" style={styles.link} onPress={openPolicy}>
              политике конфиденциальности
            </Typo>.
          </Typo>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // marginTop: SPACING.md,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  agreementTextContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: Theme.borderRadius.md,
    height: 150,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  scrollContent: {
    flexGrow: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    width:'100%',
    display: 'flex',
    alignItems: 'center',
  },
  checkboxContainer: {
    alignItems: 'center',
    gap: SPACING.md,
    flexDirection:'row',
    width: '100%',
    marginRight: SPACING.sm,
  },
  checkbox: {

    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.neutral.mxedium,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary.main,
    borderColor: COLORS.primary.main,
  },
  checkboxLabel: {
    top: 2,
    flex: 1,
    color: COLORS.neutral.darkest,
  },
  link: {
    color: COLORS.primary.main,
    textDecorationLine: 'underline',
  },
});

export default AgreementSection;
