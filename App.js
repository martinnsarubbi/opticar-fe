import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ModulesScreen from './screens/ModulesScreen';
import PlanningScreen from './screens/planning/PlannningScreen';
import SizingScreen from './screens/sizing/SizingScreen';
import TruckScreen from './screens/planning/TruckScreen';
import HomeHeader from './components/HomeHeader';
import DeliveriesScreen from './screens/deliveries/DeliveriesScreen'
import DeliveriesDetailScreen from './screens/deliveries/DeliveriesDetailScreen';
import BarcodeScreen from './screens/sizing/BarcodeScreen';
import NewDeliveryScreen from './screens/deliveries/NewDeliveryScreen';
import TruckLoadScreen from './screens/truck-loading/TruckLoadScreen';
import SizingItemsScreen from './screens/sizing/SizingItemsScreen';
import ARScreen from './screens/sizing/ar/ARScreen';


const Stack = createNativeStackNavigator();

export default function App() {

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white'
    },
  };

  return (
    <>
      <StatusBar style='auto' />
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator>
          <Stack.Screen 
            name='Inicio'
            component={ModulesScreen}
            options={{
              headerTitle: (props) => <HomeHeader/>
            }}
          />
          <Stack.Screen name='Entregas' component={DeliveriesScreen} />
          <Stack.Screen name='Detalle de entrega' component={DeliveriesDetailScreen} />
          <Stack.Screen name='Nueva entrega' component={NewDeliveryScreen} />
          <Stack.Screen name='Dimensionamiento de nuevo producto' component={SizingScreen} />
          <Stack.Screen name='Código de barras' component={BarcodeScreen} />
          <Stack.Screen name='Transporte' component={TruckScreen} />
          <Stack.Screen name='Planificación' component={PlanningScreen} />
          <Stack.Screen name='Carga' component={TruckLoadScreen} />
          <Stack.Screen name='Dimensionamiento de productos' component={SizingItemsScreen} />
          <Stack.Screen name='Medición' component={ARScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {

  },
});