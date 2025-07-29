import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import Theme, { COLORS, SPACING } from '../../../core/styles/theme';
import {Typo}from '../../../shared/ui/typo/typo';

const AgreementSection = ({ checked, onCheckboxChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.agreementTextContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} persistentScrollbar>
          <Typo>Предупреждение</Typo>
          <Typo style={{textAlign:'left'}} variant="body2" color={COLORS.neutral.medium}>
            Обратите внимание: предлагаемая программа по достижению желаемого веса может оказаться неэффективной в следующих случаях.

            Употребление антибиотиков
            Антибиотики, являясь важнейшими средствами лечения бактериальных инфекций, тем не менее, могут негативно влиять на процесс похудения. Установлено, что даже непродолжительное применение антибиотиков существенно изменяет состав кишечной микрофлоры, что приводит к нарушению метаболических процессов и, как следствие, затрудняет снижение веса. Кроме того, длительный прием антибиотиков повышает риск развития инсулинорезистентности, что также негативно сказывается на процессе похудения.
            Подробнее здесь:
            Li, S. The potential impact of antibiotic exposure on the microbiome and human health / S. Li, J. Liu, X. Zhang, Q. Gu, Y. Wu, X. Tao, T. Tian, G. Pan, M. Chu // Microorganisms. – 2025. – Vol. 13. – P. 602.
            https://www.mdpi.com/2076-2607/13/3/602

            Приём антидепрессантов
            Антидепрессанты, несмотря на их ключевую роль в лечении депрессии и тревожных расстройств, могут существенно затруднять процесс похудения. Исследования показывают, что набор веса при приёме антидепрессантов может быть связан с несколькими факторами: изменением уровня серотонина, влияющим на пищевое поведение, замедлением метаболизма и понижением чувствительности тканей к инсулину. Особенно выраженный негативный эффект наблюдается в первые месяцы терапии, когда риск увеличения веса наиболее высок.
            Подробнее здесь:
            Alonso-Pedrero L., Bes-Rastrollo M., Marti A. Effects of antidepressant and antipsychotic use on weight gain: A systematic reviews // Obesity Review. – 2019. – Vol. 20, № 12. – P. 1680-1690.
            https://onlinelibrary.wiley.com/doi/abs/10.1111/obr.12934

            Нарушения сна
            Недостаток сна приводит к нарушению баланса гормонов грелина и лептина, что вызывает повышение аппетита и снижение чувства насыщения. При регулярном недосыпе происходит замедление метаболизма и формирование положительного энергетического баланса (когда человек потребляет больше калорий, чем тратит), что в совокупности способствует набору веса. Нерегулярный режим сна, нарушающий циркадные ритмы организма, также приводит к повышению потребления калорий и накоплению жировых отложений, особенно в области живота.
            Подробнее здесь:
            Chaput J.P., McHill A.W., Cox R.C., Broussard J.L., Dutil C., da Costa B.G.G., Sampasa-Kanyinga H., Wright K.P. Jr. The role of insufficient sleep and circadian misalignment in obesity // Nature Reviews. Endocrinology. – 2023. – Vol. 19, № 2. – P. 82-97.
            https://pubmed.ncbi.nlm.nih.gov/36280789/

            Нарушение баланса между работой и личной жизнью
            Хронический стресс, вызванный переработками и недостатком времени на отдых, приводит к повышению уровня кортизола, что провоцирует тягу к высококалорийной пище и накопление жировых отложений. Кроме того, постоянный цейтнот вынуждает людей выбирать быстрые перекусы вместо полноценных приемов пищи, что нарушает режим питания и ведет к перееданию. В результате формируется замкнутый круг: недостаток времени на физическую активность и нездоровое питание еще больше усиливают стресс и нарушают гормональный баланс, что существенно затрудняет контроль веса и поддержание здорового образа жизни
            Подробнее здесь:
            Virtanen, M. Long working hours and change in body weight: analysis of individual-participant data from 19 cohort studies / M. Virtanen, M. Jokela, T. Lallukka et al. // International Journal of Obesity. – 2020. – Vol. 44, № 7. – P. 1368-1375
            https://www.nature.com/articles/s41366-019-0480-3

            Убедитесь, что у вас не имеется препятствий, которые могут снизить эффективность и результативность предлагаемой программы. Если они все же есть, запишитесь на дополнительную консультацию к специалисту
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
          Согласен с условиями
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
    top:2,
    color: COLORS.neutral.darkest,
  },
});

export default AgreementSection;
