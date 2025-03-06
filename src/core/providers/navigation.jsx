import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import WelcomeScreen from "../../pages/welcome/WelcomeScreen";

const Stack = createStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerShown: false,
                    cardStyle:{backgroundColor: "transparent"},
                    animationEnabled:true
            }}
            >
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;