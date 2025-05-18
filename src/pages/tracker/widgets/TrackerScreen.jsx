import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRecoilState } from 'recoil';

import AddTrackModal from './AddTrackModal';

import { COLORS, SPACING, BORDER_RADIUS } from '~/core/styles/theme';
import { getCurrentWeekdays, updateTrackStatus } from '~/pages/tracker/lib/utils';
import { trackerState } from '~/pages/tracker/state/tracker.state';
import TrackItem from '~/pages/tracker/widgets/TrackItem';
import ScreenBackground from '~/shared/ui/layout/ScreenBackground';
import ScreenTransition from '~/shared/ui/layout/ScreenTransition';
import Typo from '~/shared/ui/typo';

const TrackerScreen = () => {
  const [tracker, setTracker] = useRecoilState(trackerState);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const weekdays = getCurrentWeekdays();

  const { tracks } = tracker;

  const handlePlusPress = () => {
    setIsAddModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsAddModalVisible(false);
  };

  const handleAddTrack = (newTrack) => {
    setTracker((prev) => ({
      ...prev,
      tracks: [newTrack, ...prev.tracks],
    }));
  };

  const handleTrackStatusChange = (trackId, dayIndex, status) => {
    setTracker((prev) => {
      const updatedTracks = prev.tracks.map((track) => {
        if (track.id === trackId) {
          return updateTrackStatus(track, dayIndex, status);
        }
        return track;
      });

      return {
        ...prev,
        tracks: updatedTracks,
      };
    });
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
        {weekdays.map((day, index) => (
          <View key={index} style={styles.dayLabelItem}>
            <Typo variant="caption" style={styles.dayLabelText}>
              {day.label}
            </Typo>
            <Typo variant="body2" weight="medium">
              {day.day}
            </Typo>
          </View>
        ))}
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
    width:'100%',
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
  dayLabelText: {
    textTransform: 'uppercase',
    color: COLORS.neutral.medium,
  },
});

export default TrackerScreen;
