import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Typo } from '../typo';
import { BORDER_RADIUS, COLORS, SPACING } from '../../../core/styles/theme';
import InfoModal from '../../../widgets/modal/InfoModal';

export const Tooltip = ({ content, position = 'bottom', children }) => {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setTimeout(()=>setVisible(true),50);
  };

  const handleClose = () => {
    setTimeout(()=>setVisible(false),50);

  };
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleOpen}>
        <View>{children}</View>
      </TouchableWithoutFeedback>

      <InfoModal
        text={content}
        visible={visible}
        onClose={handleClose}
        title={'Что это такое?'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: COLORS.neutral.dark,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    maxWidth: 200,
    zIndex: 100,
  },
  text: {
    color: COLORS.neutral.white,
  },
});