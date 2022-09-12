import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Icon, Tooltip } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import { fetchDeliveries, fetchTrucks, planningAlgorithm } from '../../util/http';
import Button from '../../components/Button';

function PlanningScreen({ navigation, route }) {

  const [date, setDate] = useState(new Date());
  const [markers, setMarkers] = useState([ { coordinates: { latitude: 37.78383, longitude: -122.405766 } } ]);
  const [loaded, setLoaded] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [deliveryTooltipOpen, setDeliveryTooltipOpen] = useState(false)
  const [truckTooltipOpen, setTruckTooltipOpen] = useState(false)
  const [deliveries, setDeliveries] = useState();
  const [trucks, setTrucks] = useState();
  const [deliveryCount, setDeliveryCount] = useState(0);
  const [truckCount, setTrucksCount] = useState(0);
  const [deliveriesFetched, setDeliveriesFetched] = useState(false);
  const [trucksFetched, setTrucksFetched] = useState(false);
  const [inputValues, setInputValues] = useState({ 
    deliveryDate: ''
  });
  const mapRef = useRef(null);

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  useEffect(() => {
    if (route.params?.deliveries) {
      getDeliveries(route.params.deliveries)
    }
  }, [route.params?.deliveries]);

  useEffect(() => {
    if (route.params?.trucks) {
      getTrucks(route.params.trucks)
    }
  }, [route.params?.trucks]);

  useEffect(() => {
      if(!deliveriesFetched) {
        getDeliveries(null);
      }
      if(!trucksFetched) {
        getTrucks(null);
      }
    }, [])

  async function getDeliveries(input) {
    try {
      let deliveriesList = null;
      if(!deliveriesFetched) {
        deliveriesList = await fetchDeliveries(true, false);
        setDeliveriesFetched(true)
      } else {
        deliveriesList = input;
      }
      const markers = [];
      let deliveryCounter = 0;
      for(const key in deliveriesList) {
        if(deliveriesList[key].checkedForPlanning == true) {
          deliveryCounter += 1;
          const coordinatesObj = {
            coordinates: {
              longitude: deliveriesList[key].customerLongitude,
              latitude: deliveriesList[key].customerLatitude,
            },
            name: deliveriesList[key].productName
          }
          markers.push(coordinatesObj);
        }
      }

      setDeliveryCount(deliveryCounter)
      setDeliveries(deliveriesList);
      setMarkers(markers);
    } catch(error) {
      console.log('Error: ' + error)
    }
  }

  async function getTrucks(input) {
    try {
      let trucksList = null;
      if(!trucksFetched) {
        trucksList = await fetchTrucks();
        setTrucksFetched(true)
      } else {
        trucksList = input;
      }
      const markers = [];
      let truckCounter = 0;
      for(const key in trucksList) {
        if(trucksList[key].checkedForPlanning == true) {
          truckCounter += 1;
        }
      }
      setTrucksCount(truckCounter)
      setTrucks(trucksList);
    } catch(error) {
      console.log('Error: ' + error)
    }
  }


  function deliveriesPressHandler() {
    navigation.navigate('Selección de entregas' , { deliveries })
  }

  function trucksPressHandler() {
    navigation.navigate('Selección de transporte', { trucks })
  }

  async function startPlanning() {
    try {
      const planningData = {
        deliveriesInfo: deliveries,
        trucksInfo: trucks
      }
      let plan = await planningAlgorithm(planningData);
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          Fecha de envío: {[padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1),date.getFullYear(),].join('/')}
        </Text>
        <Icon
          name='calendar'
          type='material-community'
          style={styles.dateIcon}
          size={30}
          color='grey'
          onPress={() => setOpenDatePicker(true)}
        />
        <DatePicker
          modal
          open={openDatePicker}
          mode="date"
          date={date}
          onConfirm={(date) => {
            setOpenDatePicker(false)
            setDate(date)
            console.log(date)
            setInputValues((curInputValues) => ({
              ...curInputValues,
              deliveryDate: [
                  padTo2Digits(date.getDate()),
                  padTo2Digits(date.getMonth() + 1),
                  date.getFullYear(),
                ].join('/')
          }))}}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
        />
      </View>
      <View style={styles.dtContainer}>
        <Pressable
          onPress={() => {
            trucksPressHandler();
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? '#e2e2e2'
                : 'white',
              opacity: pressed
                ? 0.75 : 1
            },
            styles.trucksContainer
          ]}
        >
          <View style={styles.dtTitleContainer}>
            <Text style={styles.dtText}>Transportes</Text>
            <Tooltip
              visible={truckTooltipOpen}
              onOpen={() => {
                setTruckTooltipOpen(true);
              }}
              onClose={() => {
                setTruckTooltipOpen(false);
              }}
              width={300}
              height={100}
              backgroundColor='white'
              overlayColor='#93a2b899'
              popover={<Text>
                Si es un producto frágil que puede romperse fácilmente (vidrio, porcelana o similares) marcá esta opción.
              </Text>}
            >
              <Icon
                name='info-with-circle'
                color='white'
                type='entypo'
                style={{paddingLeft: 10}}
              />    
            </Tooltip>
          </View>
          <View style={styles.dtValueContainer}>
            <Text style={styles.dtValue}>{truckCount}</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            deliveriesPressHandler();
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? '#e2e2e2'
                : 'white',
              opacity: pressed
                ? 0.75 : 1
            },
            styles.deliveriesContainer
          ]}
        >
          <View style={styles.dtTitleContainer}>
            <Text style={styles.dtText}>Entregas</Text>
            <Tooltip
              visible={deliveryTooltipOpen}
              onOpen={() => {
                setDeliveryTooltipOpen(true);
              }}
              onClose={() => {
                setDeliveryTooltipOpen(false);
              }}
              width={300}
              height={100}
              backgroundColor='white'
              overlayColor='#93a2b899'
              popover={<Text>
                Si es un producto frágil que puede romperse fácilmente (vidrio, porcelana o similares) marcá esta opción.
              </Text>}
            >
              <Icon
                name='info-with-circle'
                color='white'
                type='entypo'
                style={{paddingLeft: 10}}
              />    
            </Tooltip>
          </View>
          <View style={styles.dtValueContainer}>
            <Text style={styles.dtValue}>{deliveryCount}</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: -34.604593,
            longitude: -58.428880,
            latitudeDelta: 0.1822,
            longitudeDelta: 0.0421,
          }}
          ref={mapRef}
          onRegionChangeComplete={(region) => { 
            if (!loaded) { 
              if (region.latitude != -34.604593 || region.longitude != -58.428880) {
                mapRef.current.animateToRegion({latitude: -34.604593, longitude: -58.428880, latitudeDelta: 0.1822, longitudeDelta: 0.0421, }, 1)
              }
              setLoaded(true)
            } 
          }}
        >
          {markers.map((item, index) => (
            <Marker key={index} title={item.name} coordinate={item.coordinates} />
          ))}
        </MapView>
      </View>
      <Button style={styles.button} onPress={startPlanning}>
        Planificar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    height: 250,
    width: '100%',
    margin: 10
  },
  dateIcon: {
    marginLeft: 10,
  },
  dateText: {
    fontSize: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 30,
    padding: 15,
    marginTop: 5,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  dtContainer: {
    flexDirection: 'row',
    marginTop: 5
  },
  trucksContainer: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 5,
    width: '45%',
    borderRadius: 30,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  deliveriesContainer: {
    backgroundColor: 'red',
    padding: 10,
    margin: 5,
    width: '45%',
    borderRadius: 30,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  dtTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  dtText: {
    fontSize: 20,
    color: 'white'
  },
  dtValue: {
    fontSize: 40,
    color: 'white'
  },
  dtValueContainer: {
    alignItems: 'center'
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
    position: 'absolute',
    bottom: 40,
  },
})

export default PlanningScreen;