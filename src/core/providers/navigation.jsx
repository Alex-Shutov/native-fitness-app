import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import WelcomeScreen from "../../pages/welcome/WelcomeScreen";
import { customTransition } from "~/shared/lib/animations/transitions";
import StartScreen from "~/pages/welcome/StartScreen";

const Stack = createStackNavigator();


const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerShown: false,
                    cardStyle:{backgroundColor: "transparent"},
                    animationEnabled:true,
                  ...customTransition
            }}
            >
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Start" component={StartScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;