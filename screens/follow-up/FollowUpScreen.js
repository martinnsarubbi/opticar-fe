import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, FlatList } from 'react-native';
import { getPlan, updatePlanStatus } from '../../util/http';
import { CheckBox } from '@rneui/themed';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_API_KEY } from '../../environment'; 
import Button from '../../components/Button';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import { Icon } from '@rneui/themed';

function FollowUpScreen() {
  
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [plan, setPlan] = useState();
  const [deliveries, setDeliveries] = useState();
  const [truck, setTruck] = useState();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);
  const mapRef = useRef(null);
  const [originalOriginLocation, setOriginalOriginLocation] = useState({})
  const [originLocation, setOriginLocation] = useState({
    latitude: -34.604593,
    longitude: -58.428880,
    latitudeDelta: 0.1822,
    longitudeDelta: 0.0421,
  })
  const [destinationLocation, setDestinationLocation] = useState({});

  const [waypoints, setWaypoints] = useState([{}]);
  const [planningMarkers, setPlanningMarkers] = useState([{}]);
  const [loaded, setLoaded] = useState(false);
  const [markers, setMarkers] = useState([{ coordinates: { latitude: 37.78383, longitude: -122.405766 } }]);

  const [isCheckbox1, setIsCheckbox1] = React.useState(false);
  const handleCheckbox1 = () => setIsCheckbox1(() => {setIsCheckbox1(true); setIsCheckbox2(false); setIsCheckbox3(false); setIsCheckbox4(false)});
  const [isCheckbox2, setIsCheckbox2] = React.useState(false);
  const handleCheckbox2 = () => setIsCheckbox2(() => {setIsCheckbox1(false); setIsCheckbox2(true); setIsCheckbox3(false); setIsCheckbox4(false)});
  const [isCheckbox3, setIsCheckbox3] = React.useState(false);
  const handleCheckbox3 = () => setIsCheckbox3(() => {setIsCheckbox1(false); setIsCheckbox2(false); setIsCheckbox3(true); setIsCheckbox4(false)});
  const [isCheckbox4, setIsCheckbox4] = React.useState(false);
  const handleCheckbox4 = () => setIsCheckbox4(() => {setIsCheckbox1(false); setIsCheckbox2(false); setIsCheckbox3(false); setIsCheckbox4(true)});
  
  async function handleModalConfirm() {
    setIsModalVisible(() => !isModalVisible);
    let response = await updatePlanStatus([date.getFullYear(),  padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join(''), 'Finalizado');
  }

  const renderTrucklItem = ({item}) => (
    <View style={{flex: 1, backgroundColor: 'white', width: 80, height: 100, flexDirection: 'column', alignItems:'center', padding: 10, margin: 10, borderRadius: 10, shadowColor: 'black', shadowOpacity: 1}}>
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


  useEffect(() => {
    getPlanData();
  }, []);

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }


  async function getPlanData() {
    try {
      let response = await getPlan([date.getFullYear(),  padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join(''));
      setPlan(response);
      if(response[0] !== undefined) {
        const coordinatesObj = {
          coordinates: {
            longitude: response[0].initialLongitude,
            latitude: response[0].initialLatitude,
          },
          name: "Punto de origen",
          color: 'blue'
        }
        setMarkers(prevState => [...prevState, coordinatesObj]);
        setOriginLocation({
          longitude: response[0].initialLongitude,
          latitude: response[0].initialLatitude,
        })
        setOriginalOriginLocation({
          longitude: response[0].initialLongitude,
          latitude: response[0].initialLatitude,
        })
        setDestinationLocation({
          longitude: response[0].initialLongitude,
          latitude: response[0].initialLatitude,
        })
      }
      console.log("Llegue1");
    } catch (error) {
      console.log(error)
    }
  }

  function tripPressHandler(trip) {
    setDeliveries(trip.load);
    var arr = []
    arr.push(trip)
    setTruck(arr)
    let waypointsArray = []
    for(let i = 0; i < trip.load.length; i++) {
        const coordinatesObj = {
          coordinates: {
            longitude: trip.load[i].orderedDelivery.delivery.customer.longitude,
            latitude: trip.load[i].orderedDelivery.delivery.customer.latitude
          },
          name: trip.load[i].orderedDelivery.delivery.customer.address,
          color: 'red'
        }
        setMarkers(prevState => [...prevState, coordinatesObj]);
      let coordinate = {
        latitude: trip.load[i].orderedDelivery.delivery.customer.latitude,
        longitude: trip.load[i].orderedDelivery.delivery.customer.longitude,
      }
      waypointsArray.push(coordinate);
    }
    setWaypoints(waypointsArray)
    setOriginLocation({
      longitude: trip.initialLongitude,
      latitude: trip.initialLatitude,
    })

  }

  function directionPressHandler(item) {
    
    let waypointsArray = []
    let coordinate = {
      latitude: item.orderedDelivery.delivery.customer.latitude,
      longitude: item.orderedDelivery.delivery.customer.longitude,
    }
    let coordinate2 = {
      latitude: (parseFloat(item.orderedDelivery.delivery.customer.latitude) + 0.0001).toFixed(6),
      longitude: (parseFloat(item.orderedDelivery.delivery.customer.longitude) + 0.0001).toFixed(6)
    }

    waypointsArray.push(coordinate);

    for(let i = 0; i < deliveries.length; i++) {
      if(deliveries[i].orderedDelivery.position === (item.orderedDelivery.position - 1)) {
        console.log("!!!" + deliveries[i].orderedDelivery.position + "!!!" + (item.orderedDelivery.position - 1))
        setOriginLocation({
          longitude: deliveries[i].orderedDelivery.delivery.customer.longitude,
          latitude: deliveries[i].orderedDelivery.delivery.customer.latitude
        })
      } else if (deliveries.length === i-1)(
        setOriginLocation(originalOriginLocation)
      )
    }

    setWaypoints(waypointsArray);
    setDestinationLocation(coordinate2);

  }

  console.log(waypoints)
  console.log(originLocation)
  console.log(destinationLocation)


  function uiCheckPressHandler(item) {
    let newDeliveries = [...deliveries];
    for(const key in deliveries) {
      if(item.key == newDeliveries[key].key) {
        newDeliveries[key].uiCheck = !item.uiCheck
      }
    }
    setDeliveries(newDeliveries);
    setIsModalVisible(true);
  }

  function deliveredPressHandler(reason) {
    

  }

  const renderDeliveryItem = ({item}) => (
    <Pressable
    onPress={() => directionPressHandler(item)}
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
          checked={item.uiCheck}
          onPress={() => uiCheckPressHandler(item)}
        />
      </View>
      <View style={styles.rowMiddle}>
        <Text style={styles.productText}>{item.orderedDelivery.delivery.product.productName}</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.volumeText}>{(item.height * item.width * item.length / 1000000).toFixed(2)} m3</Text>
      </View>
    </Pressable>
  )

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
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
            getPlanData()
          }}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
        />
      </View>
      <View style={{flex: 0.7}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View>
            <FlatList
              data={plan}
              renderItem={renderTrucklItem}
              extraData={plan}
              keyExtractor={item => item.key}
              style={{flex: 1, height: 300, width: 100}}
            />
          </View>
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
                destination={destinationLocation}
                apikey={GOOGLE_API_KEY}
                strokeWidth={3}
                strokeColor="blue"
              />
              {markers.map((item, index) => (
                <Marker key={index} title={item.name} coordinate={item.coordinates} pinColor={item.color} />
              ))}
            </MapView>
          </View>
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'column', height: 300}}>
        <FlatList
          data={deliveries}
          renderItem={renderDeliveryItem}
          extraData={deliveries}
          keyExtractor={item => item.key}
          style={{flex: 1, marginBottom: 20, backgroundColor: 'white'}}
        />
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center', marginTop: 200, marginBottom: 200, borderRadius: 20, paddingTop: 40, paddingHorizontal: 20 }}>
          <Text style={{fontSize: 15}}>Indique si ha entregado el producto.</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'flex-start'}}>
            <View style={{}}>
              <CheckBox
                accessibilityRole='button'
                center
                uncheckedIcon="circle-o"
                checkedIcon="dot-circle-o"
                checked={isCheckbox1}
                onPress={handleCheckbox1}
              />
            </View>
            <View style={{}}>
              <Text style={styles.productText}>Se ha entregado el producto.                          </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <View style={{}}>
              <CheckBox
                accessibilityRole='button'
                center
                uncheckedIcon="circle-o"
                checkedIcon="dot-circle-o"
                checked={isCheckbox2}
                onPress={handleCheckbox2}
              />
            </View>
            <View style={{}}>
              <Text style={styles.productText}>Se ha entregado el producto roto.                 </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <View style={{}}>
              <CheckBox
                accessibilityRole='button'
                center
                uncheckedIcon="circle-o"
                checkedIcon="dot-circle-o"
                checked={isCheckbox3}
                onPress={handleCheckbox3}
              />
            </View>
            <View style={{}}>
              <Text style={styles.productText}>No se ha entregado el producto porque el cliente no estaba.</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <View style={{}}>
              <CheckBox
                accessibilityRole='button'
                center
                uncheckedIcon="circle-o"
                checkedIcon="dot-circle-o"
                checked={isCheckbox4}
                onPress={handleCheckbox4}
              />
            </View>
            <View style={{}}>
              <Text style={styles.productText}>No se entregó el producto ya que estaba dañado.</Text>
            </View>
          </View>
          
          <Button title="Hide modal" onPress={handleModal} style={{marginTop: 10}}>
            OK
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
    borderRadius: 4,
    flex: 1,
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadios: 30
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
    marginBottom: 15,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
})

export default FollowUpScreen;