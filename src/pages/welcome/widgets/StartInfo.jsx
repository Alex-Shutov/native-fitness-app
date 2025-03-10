import React from "react";
import { View,StyleSheet } from "react-native";
import AnimatedView from "~/shared/ui/animation/AnimatedView";
import Typo from "~/shared/ui/typo";
import { SPACING } from "~/core/styles/theme";

const StartInfo = () => {
  return (
    <View style={styles.section}>
      <AnimatedView>
        <Typo style={styles.title} variant={'h2'} weight={'bold'} align={"center"}>Начинаем путь к твоей стройности</Typo>
      </AnimatedView>
      <AnimatedView>
        <Typo weight={'bold'} align={"center"}  variant={'body1'}>Более 120 млн. пользователей</Typo>
      </AnimatedView>

    </View>
  );
};

const styles = StyleSheet.create({
  section:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    width: '100%',
  },
  title:{
    marginBottom:SPACING.sm
  }
})

export default StartInfo;