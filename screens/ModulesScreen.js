import { ScrollView, View, StyleSheet, Text, Pressable } from 'react-native';
import ModuleGridTitle from '../components/ModuleGridTitle';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { fetchDeliveries } from '../util/http';

function ModulesScreen({ navigation }) {

  const [sizingPending, setSizingPending] = useState(0);
  const [deliveryPending, setDeliveryPending] = useState(0);
  const [error, setError] = useState();

  function deliveriesPressHandler() {
    navigation.navigate('Entregas')
  }

  function sizingPressHandler() {
    navigation.navigate('Dimensionamiento de productos')
  }

  function truckLoadPressHandler() {
    navigation.navigate('Carga')
  }

  useEffect(() => {
    async function getDeliveryIndicators() {
      try {
        const deliveries = await fetchDeliveries(true, true);
        setDeliveryPending(deliveries.filter((obj) => obj.status === 'Pendiente de planificar').length)
        setSizingPending(deliveries.filter((obj) => obj.status === 'Pendiente de dimensionar').length)
      } catch(error) {
        setError('No se pudieron obtener las entregas.')
      }
    }
    getDeliveryIndicators();
  }, []);


  return (
    <ScrollView>
      <View style={styles.container}>
        <LinearGradient
          // Background Linear Gradient
          colors={['#eb3349', '#f5715b']}
          style={styles.salesContainer}
        >
          <Text style={styles.salesTitle}>Pedidos</Text>
          <View style={styles.salesDetailsContainer}>
            <ModuleGridTitle
              title='Dimensionar'
              backgroundColor='transparent'
              onPress={sizingPressHandler}
              indicator={sizingPending}
              unidad='paquetes'
            />
            <ModuleGridTitle
              title='Entregar'
              onPress={deliveriesPressHandler}
              indicator={deliveryPending}
              unidad='paquetes'
            />
          </View>
        </LinearGradient>
        <View
            // Background Linear Gradient
            colors={['#02aab0', '#00cdac']}
            style={styles.planificationContainer}
          >
            <Text style={styles.salesTitle}>Planificar Viajes</Text>
          </View>
        <LinearGradient
          // Background Linear Gradient
          colors={['#00254d', '#0055b3']}
          style={styles.truckLoadingContainer}
        >
          <Pressable
              onPress={truckLoadPressHandler}
              style={({ pressed }) => pressed && styles.pressed}
            >
            <Text style={styles.truckLoadingTitle}>Carga</Text>
            <Text style={styles.truckLoadingDescription}>Sin pedidos pendientes de carga.</Text>
          </Pressable>
        </LinearGradient>
        <LinearGradient
          // Background Linear Gradient
          colors={['#2EB62C', '#ABE098']}
          style={styles.followUpContainer}
        >
          <Text style={styles.followUpTitle}>Seguimiento</Text>
          <View style={styles.followUpDetailsContainer}>
            <View>
              <Text style={styles.followUpDescription}>Móviles circulando: 0</Text>
              <Text style={styles.followUpDescription}>Pedidos entregados: 0</Text>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: -34.604593,
                  longitude: -58.428880,
                  latitudeDelta: 0.1822,
                  longitudeDelta: 0.0421,
                }}
              />
              
            </View>
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
 )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  salesContainer: {
    borderRadius: 50,
    padding: 20,
    margin: 20,
  },
  salesDetailsContainer: {
    flexDirection: 'row',
  },
  salesTitle: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  planificationContainer: {
    height: 60,
    borderRadius: 60,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 11,
    elevation: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.23)',
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  truckLoadingContainer: {
    height: 120,
    borderRadius: 30,
    marginHorizontal: 20,
    padding: 15
  },
  truckLoadingTitle: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
  truckLoadingDescription: {
    color: 'white',
    fontSize: 20,
    padding: 10,
    textAlign: 'center'
  },
  followUpContainer: {
    height: 230,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15
  },
  followUpTitle: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
  followUpDescription: {
    color: 'white',
    fontSize: 15,
    padding: 2,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
  },
  mapContainer: {
    margin: 10,
    height: 150,
    width: 150,
    borderRadius: 40,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.23)',
  },
  followUpDetailsContainer: {
    flexDirection: 'row',
  },
  pressed: {
    opacity: 0.75,
    borderRadius: 4,
  },
});


export default ModulesScreen;