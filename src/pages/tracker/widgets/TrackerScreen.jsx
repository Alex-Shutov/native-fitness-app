import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';

import AddTrackModal from './AddTrackModal';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import TrackerService from '~/pages/tracker/api/tracker.service';
import {
  getCurrentWeekdayIndex,
  getCurrentWeekdays,
  isFutureDay,
  updateTrackStatus,
} from '~/pages/tracker/lib/utils';
import {Typo}from '~/shared/ui/typo';
import ScreenBackground from '../../../shared/ui/layout/ScreenBackground';
import ScreenTransition from '../../../shared/ui/layout/ScreenTransition';
import { trackerQuery, trackerState, trackerVersion } from '../state/tracker.state';
import { Tooltip } from '../../../shared/ui/tooltip/Tooltip';
import { MaterialIcons } from '@expo/vector-icons';
import TrackItem from './TrackItem';
import InfoModal from '../../../widgets/modal/InfoModal';

const TrackerScreen = () => {
  const [tracker, setTracker] = useRecoilState(trackerState);
  const trackerLoadable = useRecoilValueLoadable(trackerQuery);
  const [trackerVs, setTrackerVersion] = useRecoilState(trackerVersion);
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setTimeout(()=>setVisible(true),50);
  };

  const handleClose = () => {
    setTimeout(()=>setVisible(false),50);

  };
  useEffect(() => {
    return ()=>{
      setTrackerVersion((prev)=>prev+1)
    }
  }, []);
  useEffect(() => {
    if (trackerLoadable.state === 'hasValue') {
      setTracker(trackerLoadable.contents);
    }
  }, [trackerLoadable, setTracker]);
  const weekdays = getCurrentWeekdays();
  const currentDayIndex = getCurrentWeekdayIndex();
  const { tracks } = tracker;





  const handleAddTrack = async (newTrack) => {
    try {
      // Преобразуем данные в формат API
      const daysStatus = newTrack.completionStatus;

      // Отправляем запрос на создание трека
      const createdTrack = await TrackerService.createTrack(
        newTrack.title,
        daysStatus
      );

      // Обновляем локальное состояние
      setTracker(prev => ({
        ...prev,
        tracks: [createdTrack, ...prev.tracks]
      }));

    } catch (error) {
      console.error('Error adding track:', error);
      // Можно добавить обработку ошибки (например, показать уведомление)
    }
  };

  const handleTrackStatusChange = async (frontendTrackId, dayIndex, status) => {
    try {
      setTracker(prev => {
        const updatedTracks = prev.tracks.map(track => {
          if (track.id === frontendTrackId) {
            const newStatus = [...track.completionStatus];
            newStatus[dayIndex] = status ? 1 : 0;
            return { ...track, completionStatus: newStatus };
          }
          return track;
        });

        // 2. Формируем полный habitsStatus (25 символов)
        let fullHabitsStatus = '';
        updatedTracks.forEach(track => {
          fullHabitsStatus += track.completionStatus.join('');
        });

        // 3. Отправляем обновление на сервер
        TrackerService.updateTrackStatus(
          prev.trackerId,
          fullHabitsStatus.toString().split('').map(Number),
        ).catch(error => {
          console.error('Error updating tracker status:', error);
        });
        return { ...prev, tracks: updatedTracks };
      });
    } catch (error) {
      console.error('Error updating track status:', error);
      setTracker((prev) => ({
        ...prev,
        error,
      }))
    }
  };

  const renderItem = ({ item }) => (
    <TrackItem
      track={item}
      onStatusChange={handleTrackStatusChange}
      onPress={() => {}}
      weekdays={weekdays} // Передаем дни недели
    />
  );

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
        headerRight={
          <TouchableWithoutFeedback onPress={handleOpen}>

            <MaterialIcons
              name="help-outline"
              size={24}
              color={COLORS.neutral.dark}
            />
          </TouchableWithoutFeedback>

        }
        title={
          <View style={styles.headerContainer}>
            <Typo variant="hSub" style={styles.header}>
              Трекер
            </Typo>

          </View>
        }
        hasBackButton={false}
        contentStyle={styles.contentContainer}>
        {renderDayLabels()}

        <FlatList
          data={tracks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.container}>
          <InfoModal
            text={'Здесь вы можете отслеживать свои привычки по будням, ведь по выходным нужно дать себе отдохнуть! '}
            visible={visible}
            onClose={handleClose}
            title={'Что это такое?'}
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
  subtitle: {
    marginBottom: SPACING.lg,
    color: COLORS.neutral.dark,
  },
  listContainer: {
    position:"relative",
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
});

export default TrackerScreen;
