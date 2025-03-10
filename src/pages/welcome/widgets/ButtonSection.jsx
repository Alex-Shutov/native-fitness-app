import React from 'react';
import {Button, View,StyleSheet} from "react-native";
import AnimatedView from "../../../shared/ui/animation/AnimatedView";
import {SPACING} from "../../../core/styles/theme";

const ButtonSection = ({
    duration,
    delay,
    onPress
                       }) => {
    return (
        <View style={styles.bottomSection}>
            <AnimatedView
                animation="fade"
                duration={duration}
                delay={delay * 6}
            >
                <Button
                    title="Хочу стройнеть"
                    variant="primary"
                    size="large"
                    onPress={onPress}
                    fullWidth
                />
            </AnimatedView>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomSection:{
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: SPACING.xl,
        width: '80%',
    }
})

export default ButtonSection;