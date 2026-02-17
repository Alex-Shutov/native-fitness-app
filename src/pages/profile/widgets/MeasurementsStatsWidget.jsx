import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { Typo } from '~/shared/ui/typo';

const chestVal = (m) => m?.chest ?? m?.chestCircumference ?? 0;
const waistVal = (m) => m?.waist ?? m?.waistCircumference ?? 0;
const hipsVal = (m) => m?.hips ?? m?.hipCircumference ?? 0;

const dateKey = (m) => m?.measurementDate ?? m?.createdAt ?? m?.date ?? '';

const formatLabel = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
};

const formatDateFull = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const chartConfig = {
  backgroundColor: COLORS.neutral.white,
  backgroundGradientFrom: COLORS.neutral.offWhite,
  backgroundGradientTo: COLORS.neutral.offWhite,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(72, 105, 53, ${opacity})`,
  labelColor: () => COLORS.neutral.medium,
  style: {
    borderRadius: BORDER_RADIUS.sm,
    paddingRight: 0,
  },
  propsForLabels: {
    fontSize: 10,
  },
};

const MeasurementsStatsWidget = ({ items, statistics }) => {
  const list = items ?? [];
  const last = list[list.length - 1];
  const hasData = list.length > 0;
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);

  const forChart = useMemo(() => {
    if (!list.length) return [];

    // сортируем по дате по возрастанию и берём последние 10,
    // чтобы новые замеры добавлялись в конец графика, а не в начало
    const sorted = [...list].sort(
      (a, b) => new Date(dateKey(a)).getTime() - new Date(dateKey(b)).getTime()
    );

    return sorted.slice(-10);
  }, [list]);

  const chartData = useMemo(() => {
    if (forChart.length === 0) return null;
    return {
      labels: forChart.map((m) => formatLabel(dateKey(m)) || '—'),
      datasets: [
        { data: forChart.map(chestVal), color: () => COLORS.primary.main, strokeWidth: 2 },
        { data: forChart.map(waistVal), color: () => COLORS.primary.dark, strokeWidth: 2 },
        { data: forChart.map(hipsVal), color: () => COLORS.neutral.medium, strokeWidth: 2 },
      ],
    };
  }, [forChart]);

  const selectedPoint =
    selectedPointIndex != null && forChart[selectedPointIndex] != null ? forChart[selectedPointIndex] : null;

  const chartWidth = Math.max(Dimensions.get('window').width - SPACING.md * 4 - 48, 260);
  const chartHeight = 180;

  return (
    <View style={styles.card}>
      {hasData && last && (
        <View style={styles.lastRow}>
          <View style={styles.miniBox}>
            <Typo variant="caption" style={styles.miniLabel}>
              Грудь
            </Typo>
            <Typo variant="body1" weight="bold" style={styles.miniValue}>
              {chestVal(last) || '—'}
            </Typo>
          </View>
          <View style={styles.miniBox}>
            <Typo variant="caption" style={styles.miniLabel}>
              Талия
            </Typo>
            <Typo variant="body1" weight="bold" style={styles.miniValue}>
              {waistVal(last) || '—'}
            </Typo>
          </View>
          <View style={styles.miniBox}>
            <Typo variant="caption" style={styles.miniLabel}>
              Бёдра
            </Typo>
            <Typo variant="body1" weight="bold" style={styles.miniValue}>
              {hipsVal(last) || '—'}
            </Typo>
          </View>
        </View>
      )}

      {/* {statistics && (statistics.chestChange != null || statistics.waistChange != null || statistics.hipChange != null) && (
        <View style={styles.changesRow}>
          <Typo variant="caption" style={styles.changesLabel}>
            Изменение с первого замера:
          </Typo>
          <View style={styles.changesValues}>
            {statistics.chestChange != null && (
              <Typo variant="caption" style={styles.changeItem}>
                Грудь: {statistics.chestChange >= 0 ? '+' : ''}{statistics.chestChange}
              </Typo>
            )}
            {statistics.waistChange != null && (
              <Typo variant="caption" style={styles.changeItem}>
                Талия: {statistics.waistChange >= 0 ? '+' : ''}{statistics.waistChange}
              </Typo>
            )}
            {statistics.hipChange != null && (
              <Typo variant="caption" style={styles.changeItem}>
                Бёдра: {statistics.hipChange >= 0 ? '+' : ''}{statistics.hipChange}
              </Typo>
            )}
          </View>
        </View>
      )} */}

      {chartData && chartData.labels.length >= 1 && (
        <View style={styles.chartWrap}>
          <TouchableWithoutFeedback onPress={() => setSelectedPointIndex(null)}>
            <View>
              <LineChart
                data={chartData}
                width={chartWidth}
                height={chartHeight}
                chartConfig={chartConfig}
                bezier
                withDots
                withInnerLines
                withOuterLines
                fromZero={false}
                style={styles.chart}
                onDataPointClick={({ index }) => {
                  setSelectedPointIndex((prev) => (prev === index ? null : index));
                }}
                renderDotContent={({ x, y, index }) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedPointIndex((prev) => (prev === index ? null : index))}
                    style={[styles.dotTouch, { left: x - 18, top: y - 18 }]}
                  />
                )}
              />
            </View>
          </TouchableWithoutFeedback>

          {selectedPoint && (
            <View style={styles.tooltip}>
              <Typo variant="caption" weight="bold" style={styles.tooltipDate}>
                {formatDateFull(dateKey(selectedPoint))}
              </Typo>
              <View style={styles.tooltipRow}>
                <Typo variant="caption" style={styles.tooltipLabel}>
                  Грудь:
                </Typo>
                <Typo variant="body2" weight="medium">
                  {chestVal(selectedPoint)} см
                </Typo>
              </View>
              <View style={styles.tooltipRow}>
                <Typo variant="caption" style={styles.tooltipLabel}>
                  Талия:
                </Typo>
                <Typo variant="body2" weight="medium">
                  {waistVal(selectedPoint)} см
                </Typo>
              </View>
              <View style={styles.tooltipRow}>
                <Typo variant="caption" style={styles.tooltipLabel}>
                  Бёдра:
                </Typo>
                <Typo variant="body2" weight="medium">
                  {hipsVal(selectedPoint)} см
                </Typo>
              </View>
              <Typo variant="caption" style={styles.tooltipHint}>
                Нажмите на точку ещё раз или на график, чтобы закрыть
              </Typo>
            </View>
          )}

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary.main }]} />
              <Typo variant="caption" style={styles.legendText}>
                Грудь
              </Typo>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary.dark }]} />
              <Typo variant="caption" style={styles.legendText}>
                Талия
              </Typo>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.neutral.medium }]} />
              <Typo variant="caption" style={styles.legendText}>
                Бёдра
              </Typo>
            </View>
          </View>
        </View>
      )}

      {!hasData && (
        <Typo variant="body2" style={styles.emptyText}>
          Пока нет замеров. Добавьте первые измерения.
        </Typo>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  lastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  miniBox: {
    flex: 1,
    alignItems: 'center',
  },
  miniLabel: {
    color: COLORS.neutral.medium,
    marginBottom: 2,
  },
  miniValue: {
    color: COLORS.primary.dark,
  },
  changesRow: {
    marginBottom: SPACING.sm,
  },
  changesLabel: {
    color: COLORS.neutral.medium,
    marginBottom: 4,
  },
  changesValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  changeItem: {
    color: COLORS.primary.dark,
  },
  chartWrap: {
    marginTop: SPACING.sm,
  },
  dotTouch: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  tooltip: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.primary.extraLight,
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary.main,
  },
  tooltipDate: {
    color: COLORS.primary.dark,
    marginBottom: SPACING.sm,
  },
  tooltipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tooltipLabel: {
    color: COLORS.neutral.medium,
  },
  tooltipHint: {
    color: COLORS.neutral.medium,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  chart: {
    borderRadius: BORDER_RADIUS.sm,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: COLORS.neutral.dark,
  },
  emptyText: {
    color: COLORS.neutral.medium,
    textAlign: 'center',
    paddingVertical: SPACING.sm,
  },
});

export default MeasurementsStatsWidget;
