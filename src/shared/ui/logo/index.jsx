import React from 'react';
import {View,StyleSheet} from "react-native";
import Typo from "../typo";
import Theme from "../../../core/styles/theme";

const Logo = ({
    squareStyle,
    textStyle,
    style,
    variant='full',
    title='Название',
    size='medium',
              }) => {

    const getSize = () => {
        switch (size) {
            case 'small':
                return {
                    square: 30,
                    text: 'subtitle2',
                };
            case 'medium':
                return {
                    square: 50,
                    text: 'subtitle1',
                };
            case 'large':
                return {
                    square: 80,
                    text: 'h3',
                };
            default:
                return {
                    square: 50,
                    text: 'subtitle1',
                };
        }
    };

    const { square, text } = getSize();

    const renderSquare = () => (
        <View
            style={[
                styles.square,
                { width: square, height: square },
                squareStyle
            ]}
        />
    );

    const renderText = () => (
        <Typo
            variant={text}
            weight="bold"
            style={[styles.text, textStyle]}
        >
            {title}
        </Typo>
    );

    return (
        <View style={[styles.container, style]}>
            {(variant === 'square' || variant === 'full') && renderSquare()}
            {(variant === 'text' || variant === 'full') && renderText()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    square: {
        backgroundColor: Theme.colors.neutral.white,
        borderRadius: Theme.borderRadius.sm,
        marginBottom: 8,
    },
    text: {
        color: Theme.colors.neutral.darkest,
        textAlign: 'center',
    },
});

export default Logo;