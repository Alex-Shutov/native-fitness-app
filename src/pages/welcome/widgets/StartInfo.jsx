import React from "react";
import { View, StyleSheet, Dimensions } from 'react-native';
import AnimatedView from '../../../shared/ui/animation/AnimatedView';
import { Typo } from '../../../shared/ui/typo';
import Theme, { SPACING } from '../../../core/styles/theme';


const { width, height } = Dimensions.get('window');

const StartInfo = () => {
  return (
    <View style={styles.section}>
      <AnimatedView>
        <Typo style={styles.title} variant={'hSub'}  align={"center"}>Начинаем путь к твоей стройности</Typo>
      </AnimatedView>
      <AnimatedView>
        {/*<Typo weight={'bold'} align={"center"}  variant={'body1'}>Более 120 млн. пользователей</Typo>*/}
      </AnimatedView>

    </View>
  );
};

const styles = StyleSheet.create({
  section:{
    flex:1,
    // position:"absolute",
    // left:-100,
    // justifyContent:'center',
    // alignItems:'center',
    width:width,
    padding:SPACING.lg
  },
  title:{
    fontSize: Theme.fontSizes.xxxl,
    lineHeight: Theme.fontSizes.xxxl,
    marginBottom:SPACING.sm
  }
})

export default StartInfo;