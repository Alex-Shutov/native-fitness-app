import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
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
import { mapApiTrackToFrontend, trackerQuery, trackerState } from '~/pages/tracker/state/tracker.state';
import TrackItem from '~/pages/tracker/widgets/TrackItem';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';

const TrackerScreen = () => {
  const [tracker, setTracker] = useRecoilState(trackerState);
  const trackerLoadable = useRecoilValueLoadable(trackerQuery);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    if (trackerLoadable.state === 'hasValue') {
      setTracker(trackerLoadable.contents);
    }
  }, [trackerLoadable, setTracker]);

  const weekdays = getCurrentWeekdays();
  const currentDayIndex = getCurrentWeekdayIndex();
  const { tracks } = tracker;

  const handlePlusPress = () => {
    setIsAddModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsAddModalVisible(false);
  };

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

  const handleTrackStatusChange = async (trackId, dayIndex, status) => {
    try {
      // Обновляем локальное состояние сразу для быстрого отклика UI
      setTracker((prev) => {
        const updatedTracks = prev.tracks.map((track) => {
          if (track.id === trackId) {
            const newStatus = [...track.completionStatus];
            newStatus[dayIndex] = status ? 1 : 0;
            return { ...track, completionStatus: newStatus };
          }
          return track;
        });
        return { ...prev, tracks: updatedTracks };
      });
      // Отправляем обновление на сервер
      const track = tracker.tracks
        .map((track) => {
          if (track.id === trackId) {
            const newStatus = [...track.completionStatus];
            newStatus[dayIndex] = status ? 1 : 0;
            return { ...track, completionStatus: newStatus };
          }
          return track;
        })
        .find((track) => track.id === trackId);
      await TrackerService.updateTrackStatus(trackId, track.completionStatus);
    } catch (error) {
      // Откатываем изменения в случае ошибки
      setTracker((prev) => ({
        ...prev,
        error: error.message,
      }));
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
        title={
          <View style={styles.headerContainer}>
            <Typo variant="hSub" style={styles.header}>
              Трекер
            </Typo>
          </View>
        }
        onPlusPress={handlePlusPress}
        hasBackButton={false}
        contentStyle={styles.contentContainer}>
        {/* Заголовки дней недели */}
        {renderDayLabels()}

        <FlatList
          data={tracks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />

        <AddTrackModal
          visible={isAddModalVisible}
          onClose={handleCloseModal}
          onAddTrack={handleAddTrack}
        />
      </ScreenBackground>
    </ScreenTransition>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: SPACING.md,
    paddingBottom: 80,
  },
  headerContainer: {
    display: 'flex',
    width: '100%',
    flex: 1,
  },
  subtitle: {
    marginBottom: SPACING.lg,
    color: COLORS.neutral.dark,
  },
  listContainer: {
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
