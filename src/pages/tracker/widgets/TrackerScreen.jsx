import { MaterialIcons } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';

import AddTrackModal from './AddTrackModal';
import TrackItem from './TrackItem';
import ScreenBackground from '../../../shared/ui/layout/ScreenBackground';
import ScreenTransition from '../../../shared/ui/layout/ScreenTransition';
import { Tooltip } from '../../../shared/ui/tooltip/Tooltip';
import InfoModal from '../../../widgets/modal/InfoModal';
import TrackerService from '../api/tracker.service';
import HabitsService from '../api/habits.service';
import { mapApiTrackToFrontend, mapApiHabitToFrontend, trackerQuery, trackerState, trackerVersion } from '../state/tracker.state';
import { useRecoilValue } from 'recoil';
import { authState } from '~/pages/auth/models/auth.atom';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import {
  getCurrentWeekdayIndex,
  getCurrentWeekdays,
  isFutureDay,
  updateTrackStatus,
} from '~/pages/tracker/lib/utils';
import { Typo } from '~/shared/ui/typo';


const TrackerScreen = () => {
  const auth = useRecoilValue(authState);
  const userId = auth?.user?.id;
  const [tracker, setTracker] = useRecoilState(trackerState);
  const trackerLoadable = useRecoilValueLoadable(trackerQuery);
  const [trackerVs, setTrackerVersion] = useRecoilState(trackerVersion);
  const [habits, setHabits] = useState([]);
  const [visible, setVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchHabits = async () => {
    if (!userId) return;
    try {
      const list = await HabitsService.getHabits(userId);
      setHabits(list.map(mapApiHabitToFrontend).filter(Boolean));
    } catch (e) {
      console.error('Error fetching habits:', e);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [userId]);

  const handleOpenStats = async () => {
    try {
      setStats(null);
      const res = await TrackerService.getStats();
      setStats(res);
      setStatsVisible(true);
    } catch (err) {
      console.error('Ошибка загрузки статистики', err);
      setStats({ position: '-', totalPoints: '-', totalUsers: '-' });
      setStatsVisible(true);
    }
  };

  const handleCloseStats = () => {
    setStatsVisible(false);
  };

  const handleOpen = () => {
    setTimeout(() => setVisible(true), 50);
  };

  const handleClose = () => {
    setTimeout(() => setVisible(false), 50);
  };
  useEffect(() => {
    return () => {
      setTrackerVersion((prev) => prev + 1);
    };
  }, []);
  useEffect(() => {
    if (trackerLoadable.state === 'hasValue') {
      setTracker((prev) => {
        if (prev.tracks?.length > 0) return prev;
        return trackerLoadable.contents;
      });
    }
  }, [trackerLoadable]);
  const weekdays = getCurrentWeekdays();
  const currentDayIndex = getCurrentWeekdayIndex();
  const { tracks } = useMemo(() => tracker, [trackerLoadable, tracker]);

  const listData = useMemo(() => {
    const items = [...tracks];
    if (tracks.length > 0 && habits.length > 0) {
      items.push({ id: 'divider', isDivider: true });
      items.push(...habits);
    } else if (habits.length > 0) {
      items.push(...habits);
    }
    return items;
  }, [tracks, habits]);

  const handleAddTrack = async (newTrack) => {
    if (!userId) return;
    try {
      const pattern = (newTrack.completionStatus || []).join('');
      await HabitsService.createHabit(userId, pattern, newTrack.title);
      await fetchHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleTrackStatusChange = async (frontendTrackId, dayIndex, status) => {
    const habit = habits.find((h) => h.id === frontendTrackId);
    if (habit && userId) {
      const newStatus = [...habit.completionStatus];
      newStatus[dayIndex] = status ? 1 : 0;
      const pattern = newStatus.join('');
      try {
        await HabitsService.updateHabit(habit.habitId, userId, pattern);
        setHabits((prev) =>
          prev.map((h) =>
            h.id === frontendTrackId ? { ...h, completionStatus: newStatus } : h
          )
        );
      } catch (error) {
        console.error('Error updating habit:', error);
      }
      return;
    }

    try {
      setTracker((prev) => {
        const updatedTracks = prev.tracks.map((track) => {
          if (track.id === frontendTrackId) {
            const newStatus = [...track.completionStatus];
            newStatus[dayIndex] = status ? 1 : 0;
            return { ...track, completionStatus: newStatus };
          }
          return track;
        });

        let fullHabitsStatus = '';
        updatedTracks.forEach((track) => {
          fullHabitsStatus += track.completionStatus.join('');
        });

        TrackerService.updateTrackStatus(
          prev.trackerId,
          fullHabitsStatus.toString().split('').map(Number)
        )
          .then(() => setTrackerVersion((prev) => prev + 1))
          .catch((error) => {
            console.error('Error updating tracker status:', error);
            Sentry.captureException(error, {
              tags: { type: 'tracker status' },
              action: 'updating',
            });
          });
        return { ...prev, tracks: updatedTracks };
      });
    } catch (error) {
      console.error('Error updating track status:', error);
      setTracker((prev) => ({ ...prev, error }));
    }
  };
  const renderItem = ({ item }) => {
    if (item.isDivider) {
      return <View style={styles.divider} />;
    }
    return (
      <TrackItem
        track={item}
        onStatusChange={handleTrackStatusChange}
        onPress={() => {}}
        weekdays={weekdays}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Typo variant="body1" style={styles.emptyText}>
        У вас пока нет треков. Добавьте новый трек, нажав на кнопку "+" вверху экрана.
      </Typo>
    </View>
  );

  const renderDayLabels = () => {
    return (
      <View style={styles.dayLabelRow}>
        <View style={{ flexGrow: 3, alignSelf: 'center', marginLeft: 6 }}>
          <TouchableWithoutFeedback onPress={handleOpenStats}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
              <MaterialIcons name="star-border" size={28} color={COLORS.neutral.dark} />
              <Typo variant={''} align={""}>Статистика</Typo>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {weekdays.map((day, index) => {
          const isFuture = isFutureDay(index, currentDayIndex);
          return (
            <View key={index} style={styles.dayLabelItem}>
              <Typo
                variant="caption"
                style={[styles.dayLabelText, isFuture && styles.futureDayLabelText]}>
                {day.label}
              </Typo>
              <Typo variant="body2" weight="medium" style={[isFuture && styles.futureDayText]}>
                {day.day}
              </Typo>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScreenTransition>
      <ScreenBackground
        title={
          <View style={styles.headerContainer}>
            <Typo variant="hSub" style={styles.header}>
              Трекер
            </Typo>
          </View>
        }
        headerRight={
          <View style={styles.headerRight}>
            <TouchableWithoutFeedback onPress={handleOpen}>
              <MaterialIcons name="help-outline" size={24} color={COLORS.neutral.dark} />
            </TouchableWithoutFeedback>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => setAddModalVisible(true)}
              activeOpacity={0.8}>
              <MaterialIcons name="add" size={28} color={COLORS.neutral.white} />
            </TouchableOpacity>
          </View>
        }
        hasBackButton={false}
        contentStyle={styles.contentContainer}>
        {renderDayLabels()}

        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={tracks.length === 0 && habits.length === 0 ? renderEmptyState : null}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.container}>
          <InfoModal
            text="Здесь вы можете отслеживать свои привычки по будням, ведь по выходным нужно дать себе отдохнуть! "
            visible={visible}
            onClose={handleClose}
            title="Что это такое?"
          />
          <InfoModal
            visible={statsVisible}
            title="Ваша статистика"
            text={
              stats
                ? `Общий рейтинг: ${stats.position} из ${stats.totalUsers}\nОбщее количество баллов: ${stats.totalPoints}\n
Система начисления баллов:
за каждое выполненное действие вы получаете 10 баллов.
Дополнительно предусмотрены двойные баллы по неделям:

1-я неделя: ужин не позднее чем за 3–4 часа до сна

2-я неделя: тщательное пережёвывание пищи

3-я неделя: полный отказ от промышленного сахара

Важно: счётчик баллов обнуляется в начале каждого месяца.`
                : 'Загрузка...'
            }
            onClose={handleCloseStats}
          />
          <AddTrackModal
            visible={addModalVisible}
            onClose={() => setAddModalVisible(false)}
            onAddTrack={handleAddTrack}
          />
        </View>
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: SPACING.md,
    paddingBottom: 80,
  },
  helpIcon: {
    marginLeft: SPACING.sm,
  },
  headerContainer: {
    display: 'flex',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    marginBottom: SPACING.lg,
    color: COLORS.neutral.dark,
  },
  listContainer: {
    position: 'relative',
    zIndex: 1,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl * 2,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.neutral.medium,
  },
  dayLabelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.sm,
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.neutral.light,
    paddingBottom: SPACING.sm,
  },
  dayLabelItem: {
    width: `${9.3}%`,
    alignItems: 'center',
  },
  futureDayText: {
    color: COLORS.neutral.medium,
  },
  futureDayLabelText: {
    color: COLORS.neutral.medium,
  },
  dayLabelText: {
    textTransform: 'uppercase',
    color: COLORS.neutral.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral.light,
    marginVertical: SPACING.lg,
    marginHorizontal: SPACING.sm,
  },
});

export default TrackerScreen;
