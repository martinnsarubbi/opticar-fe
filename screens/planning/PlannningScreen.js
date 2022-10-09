import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, FlatList } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Icon, Tooltip } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import { fetchDeliveries, fetchTrucks, planningAlgorithm } from '../../util/http';
import Button from '../../components/Button';
import CancelButton from '../../components/CancelButton';
import { LinearGradient } from 'expo-linear-gradient';
import { GOOGLE_API_KEY } from '../../environment';
import { getLocationDetailsFromGoogleMapsJSON } from '../../util/location';
import Modal from 'react-native-modal';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';


function PlanningScreen({ navigation, route }) {

  const [date, setDate] = useState(new Date());
  const [markers, setMarkers] = useState([{ coordinates: { latitude: 37.78383, longitude: -122.405766 } }]);
  const [planningMarkers, setPlanningMarkers] = useState([{}]);
  const [waypoints, setWaypoints] = useState([{}]);
  const [loaded, setLoaded] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [deliveryTooltipOpen, setDeliveryTooltipOpen] = useState(false)
  const [truckTooltipOpen, setTruckTooltipOpen] = useState(false)
  const [deliveries, setDeliveries] = useState();
  const [plan, setPlan] = useState();
  const [trucks, setTrucks] = useState();
  const [deliveryCount, setDeliveryCount] = useState(0);
  const [truckCount, setTrucksCount] = useState(0);
  const [deliveriesFetched, setDeliveriesFetched] = useState(false);
  const [trucksFetched, setTrucksFetched] = useState(false);
  const [inputValues, setInputValues] = useState({
    deliveryDate: '',
    latitude: '',
    longitude: '',
    address: '',
    neighborhood: '',
    province: '',
  });
  const [originLocation, setOriginLocation] = useState({
    latitude: -34.604593,
    longitude: -58.428880,
    latitudeDelta: 0.1822,
    longitudeDelta: 0.0421,
  })
  const [deliveryFlatList, setDeliveryFlatList] = useState();


  const mapRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);
  const [isPlanningModalVisible, setIsPlanningModalVisible] = React.useState(false);
  const handlePlanningModal = () => setIsPlanningModalVisible(() => !isPlanningModalVisible);
  const [isOkPlanningModalVisible, setIsOkPlanningModalVisible] = React.useState(false);
  const handleOkPlanningModal = () => (setIsOkPlanningModalVisible(() => !isOkPlanningModalVisible)) //TODO: agregar 
  const handleConfirmationPlanningModal = () => (setIsPlanningModalVisible(() => !isPlanningModalVisible), setIsOkPlanningModalVisible(() => !isOkPlanningModalVisible))

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
    if (!deliveriesFetched) {
      getDeliveries(null);
    }
    if (!trucksFetched) {
      getTrucks(null);
    }
  }, [])

  async function getDeliveries(input) {
    try {
      let deliveriesList = null;
      if (!deliveriesFetched) {
        deliveriesList = await fetchDeliveries(true, false);
        setDeliveriesFetched(true)
      } else {
        deliveriesList = input;
      }
      const markers = [];
      let deliveryCounter = 0;
      for (const key in deliveriesList) {
        if (deliveriesList[key].checkedForPlanning == true) {
          deliveryCounter += 1;
          const coordinatesObj = {
            coordinates: {
              longitude: deliveriesList[key].customerLongitude,
              latitude: deliveriesList[key].customerLatitude,
            },
            name: deliveriesList[key].productName,
            color: 'red'
          }
          setMarkers(prevState => [...prevState, coordinatesObj]);
        }
      }

      setDeliveryCount(deliveryCounter)
      setDeliveries(deliveriesList);
    } catch (error) {
      console.log('Error: ' + error)
    }
  }

  async function getTrucks(input) {
    try {
      let trucksList = null;
      if (!trucksFetched) {
        trucksList = await fetchTrucks();
        setTrucksFetched(true)
      } else {
        trucksList = input;
      }
      const markers = [];
      let truckCounter = 0;
      for (const key in trucksList) {
        if (trucksList[key].checkedForPlanning == true) {
          truckCounter += 1;
        }
      }
      setTrucksCount(truckCounter)
      setTrucks(trucksList);
    } catch (error) {
      console.log('Error: ' + error)
    }
  }

  const onPress = (data, details) => {
    const locationDetails = getLocationDetailsFromGoogleMapsJSON(details);

    const coordinatesObj = {
      coordinates: {
        longitude: details.geometry.location.lng,
        latitude: details.geometry.location.lat,
      },
      name: "Punto de origen",
      color: 'blue'
    }
    setMarkers(prevState => [...prevState, coordinatesObj]);

    setOriginLocation({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng
    })

    console.log(originLocation);

    setInputValues((curInputValues) => ({
      ...curInputValues,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      address: data.structured_formatting.main_text,
      neighborhood: locationDetails.district,
      province: locationDetails.province,
    }))
  };

  function deliveriesPressHandler() {
    navigation.navigate('Selección de entregas', { deliveries })
  }

  function trucksPressHandler() {
    navigation.navigate('Selección de transporte', { trucks })
  }

  function tripPressHandler(trip) {
    setDeliveryFlatList(trip.load);
    
    setPlanningMarkers([])
    const coordinatesArray = [];
    const waypointsLocations = [];
    for (const position in trip.load) {
      const coordinatesObj = {
        coordinates: {
          longitude: trip.load[position].orderedDelivery.delivery.customer.longitude,
          latitude: trip.load[position].orderedDelivery.delivery.customer.latitude,
        },
        name: trip.load[position].orderedDelivery.delivery.product.productName,
        color: 'red'
      }
      coordinatesArray.push(coordinatesObj)
      waypointsLocations.push({
        longitude: trip.load[position].orderedDelivery.delivery.customer.longitude,
        latitude: trip.load[position].orderedDelivery.delivery.customer.latitude,
      })
    }
    coordinatesArray.push({
      coordinates: {
        longitude: originLocation.longitude,
        latitude: originLocation.latitude,
      },
      name: 'Punto de origen',
      color: 'blue'
    })
    setWaypoints(waypointsLocations)
    setPlanningMarkers(coordinatesArray)
  }

  async function startPlanning() {
    try {
      const planningData = {
        deliveriesInfo: deliveries,
        trucksInfo: trucks,
        originLatitude: inputValues.latitude,
        originLongitude: inputValues.longitude,
        originDescription: inputValues.address
      }
      let response = await planningAlgorithm(planningData);
      setPlan(response);
      setIsPlanningModalVisible(true);
      console.log(plan)
    } catch (error) {
      console.log(error)
    }
  }

  const renderHorizontalItem = ({item}) => (
    <View style={{flex: 1, backgroundColor: 'white', width: 100, height: 100, flexDirection: 'column', alignItems:'center', padding: 10, margin: 10, borderRadius: 10, shadowColor: 'black', shadowOpacity: 1}}>
      <Pressable
        onPress={() => { tripPressHandler(item) }}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={{flex: 1}}>
          <Image 
            style={{height: 40, width: 40}}
            source={require('../../assets/delivery-truck.png')}
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={{flex: 1, fontSize: 17}}>Viaje {item.key}</Text>
        </View>
      </Pressable>
    </View>
  )


  const renderDeliveryItem = ({item}) => (
    <Pressable
      onPress={() => {
        trucksPressHandler(item);
      }}
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? '#e2e2e2'
            : 'white',
          opacity: pressed
            ? 0.75 : 1
        },
        styles.rowContainer
      ]}
    >
      <View style={styles.rowLeft}>
        <CheckBox
          accessibilityRole='button'
          center
          checked={item.checkedForPlanning}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          onPress={() => removeTruckPressHandler(item)}
        />
      </View>
      <View style={styles.rowMiddle}>
        <Text style={styles.productText}>{item.truckDescription}</Text>
        <Text numberOfLines={1} style={styles.locationText}>{item.licensePlate}</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.volumeText}>Capacidad {item.width * item.height * item.length / 1000000} m3</Text>
      </View>
    </Pressable>
  )


  return (
    <View style={styles.container}>
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
                mapRef.current.animateToRegion({ latitude: -34.604593, longitude: -58.428880, latitudeDelta: 0.1822, longitudeDelta: 0.0421, }, 1)
              }
              setLoaded(true)
            }
          }}
        >
          {markers.map((item, index) => (
            <Marker key={index} title={item.name} coordinate={item.coordinates} pinColor={item.color} />
          ))}
        </MapView>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          Fecha de envío: {[padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear(),].join('/')}
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
            }))
          }}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
        />
      </View>
      <View style={styles.dtContainer}>
        <LinearGradient
          // Background Linear Gradient
          colors={['#2EAAFA', '#1F2F98']}
          style={styles.trucksContainer}
        >
          <Pressable
            onPress={() => { trucksPressHandler() }}
            style={({ pressed }) => pressed && styles.pressed}
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
                  Elegí los transportes que vas a usar para llevar los productos.
                </Text>}
              >
                <Icon
                  name='info-with-circle'
                  color='white'
                  type='entypo'
                  style={{ paddingLeft: 10 }}
                />
              </Tooltip>
            </View>
            <View style={styles.dtValueContainer}>
              <Text style={styles.dtValue}>{truckCount}</Text>
            </View>
          </Pressable>
        </LinearGradient>
        <LinearGradient
          // Background Linear Gradient
          colors={['#E31298', '#1402C8']}
          style={styles.deliveriesContainer}
        >
          <Pressable
            onPress={() => { deliveriesPressHandler() }}
            style={({ pressed }) => pressed && styles.pressed}
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
                  Elegí las entregas que vas a planificar.
                </Text>}
              >
                <Icon
                  name='info-with-circle'
                  color='white'
                  type='entypo'
                  style={{ paddingLeft: 10 }}
                />
              </Tooltip>
            </View>
            <View style={styles.dtValueContainer}>
              <Text style={styles.dtValue}>{deliveryCount}</Text>
            </View>
          </Pressable>
        </LinearGradient>
      </View>
      <View>
        <Pressable
          onPress={handleModal}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? '#e2e2e2'
                : 'white',
              opacity: pressed
                ? 0.75 : 1
            },
            styles.rowContainer
          ]}
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageStyle}
              source={require('../../assets/location.png')}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={{ width: 280 }}>Origen: {inputValues.address} - {inputValues.neighborhood} - {inputValues.province} </Text>
          </View>
        </Pressable>
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center', marginTop: 150, marginBottom: 300, borderRadius: 20, paddingTop: 10 }}>
          <View style={{ height: 300, flexDirection: 'column', width: 300 }}>
            <Text style={{ fontSize: 17 }}>Ingrese una dirección como punto de origen</Text>
            <GooglePlacesAutocomplete
              placeholder='Buscar dirección'
              onPress={onPress}
              style={{ marginBottom: 10 }}
              query={{
                key: GOOGLE_API_KEY,
                language: 'es',
              }}
              GooglePlacesDetailsQuery={{
                fields: 'address_component,geometry',
              }}
              fetchDetails={true}
              styles={{
                textInput: styles.googleSearchInput
              }}
            />

            <Button title="Hide modal" onPress={handleModal}>
              Aceptar
            </Button>
          </View>
        </View>
      </Modal>
      <Button style={styles.button} onPress={startPlanning}>
        Planificar
      </Button>
      <Modal isVisible={isPlanningModalVisible}>
        <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center', marginTop: 20, marginBottom: 20, borderRadius: 20, paddingTop: 20 }}>
          <View style={{ height: 600, flexDirection: 'column', width: 300 }}>
            <FlatList
              data={plan}
              renderItem={renderHorizontalItem}
              horizontal={true}
              extraData={plan}
              keyExtractor={item => item.key}
              style={{flex: 1, height: 150, paddingBottom: 130}}
            />
            <View style={{ height: 250, width: 300}}>
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
                      mapRef.current.animateToRegion({ latitude: -34.604593, longitude: -58.428880, latitudeDelta: 0.1822, longitudeDelta: 0.0421, }, 1)
                    }
                    setLoaded(true)
                  }
                }}
              >
                <MapViewDirections
                  origin={originLocation}
                  waypoints={waypoints}
                  destination={originLocation}
                  apikey={GOOGLE_API_KEY}
                  strokeWidth={3}
                  strokeColor="blue"
                />
                {planningMarkers.map((item, index) => (
                  <Marker key={index} title={item.name} coordinate={item.coordinates} pinColor={item.color} />
                ))}
              </MapView>
            </View>
            <FlatList
              data={deliveryFlatList}
              renderItem={renderDeliveryItem}
              extraData={deliveryFlatList}
              keyExtractor={item => item.orderedDelivery.delivery.deliveryNumber}
              style={{flex: 1, height: 150, paddingBottom: 200, marginBottom: 20, marginTop: 20}}
            />
            <Button title="Hide modal" onPress={handleOkPlanningModal} style={{marginBottom: 10}}>
              Aceptar
            </Button>
            <CancelButton title="Hide modal" onPress={handlePlanningModal}>
              Cancelar
            </CancelButton>
            <Modal isVisible={isOkPlanningModalVisible}>
              <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center', marginTop: 200, marginBottom: 450, borderRadius: 20, paddingTop: 40, paddingHorizontal: 20 }}>
                <Text style={{fontSize: 15}}>Se han planificado las entregas. Ya se pueden cargar al transporte.</Text>
                <Button title="Hide modal" onPress={handleConfirmationPlanningModal} style={{marginTop: 10}}>
                  OK
                </Button>
              </View>
            </Modal>
          </View>
        </View>
      </Modal>
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
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  dateIcon: {
    marginLeft: 10,
  },
  dateText: {
    fontSize: 17,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  dtContainer: {
    flexDirection: 'row',
    marginTop: 5
  },
  trucksContainer: {
    padding: 10,
    margin: 5,
    width: '45%',
    borderRadius: 30,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  deliveriesContainer: {
    padding: 10,
    margin: 5,
    width: '45%',
    borderRadius: 30,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: { width: 0, height: 2 },
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
  pressed: {
    opacity: 0.75,
    borderRadius: 4,
    flex: 1,
  },
  imageStyle: {
    height: 40,
    width: 40
  },
  imageContainer: {
    flexDirection: 'row',
    height: 40,
    width: 50,
  },
  addessContainer: {
    width: 280,
    height: 40,
  },
  textStyle: {
    fontWeight: 'bold',
    paddingLeft: 10
  },
  originContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 0,
    flexDirection: 'row'
  },
  googleSearchInput: {
    fontSize: 18,
    color: 'black',
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1
  },
  rowContainer: {
    height: 60,
    margin: 5,
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  rowLeft: {
    width: '12%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowMiddle: {
    width: '69%'
  },
  rowRight: {
    justifyContent: 'center',
    width: '19%'
  },
  productText: {
    fontWeight: 'bold'
  },
  volumeText: {
    textAlign: 'right',
  },
})

export default PlanningScreen;