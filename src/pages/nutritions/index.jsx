import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { customTransition } from '~/shared/lib/animations/transitions';
import MealDaysScreen from '~/pages/nutritions/widgets/MealDaysScreen';
import RecipeScreen from '~/pages/nutritions/widgets/RecipeScreen';
import MealCategoriesScreen from '~/pages/nutritions/widgets/MealCategoriesScreen';



const Stack = createStackNavigator();

export const NutritionStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...customTransition,
      }}>
      <Stack.Screen name="MealCategories" component={MealCategoriesScreen} />
      <Stack.Screen name="MealDaysScreen" component={MealDaysScreen} />
      <Stack.Screen name="RecipeScreen" component={RecipeScreen} />
    </Stack.Navigator>
  );
};

export default NutritionStack;