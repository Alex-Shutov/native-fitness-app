import React from 'react';
import {SafeAreaView, View,StyleSheet} from "react-native";
import Theme from "../../../core/styles/theme";

const Container = ({
    children,
    backgroundColor,
    padding,
    style,
    type='standart',
    fullScreen=false,
    safeArea=true,
    ...props
                   }) => {
    const ContainerComponent = safeArea ? SafeAreaView : View

    const getTypeStyle = () => {
        switch (type) {
            case 'standard':
                return styles.standard;
            case 'centered':
                return styles.centered;
            default:
                return styles.standard;
        }
    };

    const getBackgroundColorStyle = () => {
        if (backgroundColor) {
            return { backgroundColor };
        }
        return {};
    };

    const getPaddingStyle = () => {
        if (padding !== undefined) {
            return { padding };
        }
        return {};
    };

    return (
        <ContainerComponent
            style={[
                styles.container,
                fullScreen ? styles.fullScreen : styles.withPadding,
                getTypeStyle(),
                getBackgroundColorStyle(),
                getPaddingStyle(),
                style
            ]}
            {...props}
        >
            {children}

        </ContainerComponent>
    );
};

const styles = StyleSheet.create({
    container: {

        flex:1,
        backgroundColor:'transparent',
    },
    fullScreen: {
        padding:0
    },
    withPadding: {
        padding: Theme.spacing.xxl,
    },
    standart:{
        justifyContent:'flex-start',
        alignItems:'stretch',
    },
    centered: {
        justifyContent:'center',
        alignItems:'center',
    }
})

export default Container;