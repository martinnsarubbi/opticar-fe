import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import FollowUpScreen from './screens/FollowUpScreen';
import ModulesScreen from './screens/ModulesScreen';
import PlanningScreen from './screens/PlannningScreen';
import ProductScreen from './screens/ProductScreen';
import SizingScreen from './screens/SizingScreen';
import TruckLoadScreen from './screens/TruckLoadScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style='auto' />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Módulos' component={ModulesScreen} />
          <Stack.Screen name='Dimensionamiento' component={SizingScreen} />
          <Stack.Screen name='Planificación' component={PlanningScreen} />
          <Stack.Screen name='Carga' component={TruckLoadScreen} />
          <Stack.Screen name='Seguimiento' component={FollowUpScreen} />
          <Stack.Screen name='Producto' component={ProductScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {

  },
});
