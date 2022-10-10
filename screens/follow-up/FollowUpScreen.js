import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, FlatList, ImageEditor } from 'react-native';
import { planningAlgorithm } from '../../util/http';
import { CheckBox } from '@rneui/themed';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_API_KEY } from '../../environment'; 

const planningData = {
  "originLatitude": -34.66733,
  "originLongitude": -58.4397737,
  "originDescription": "Centro de Ditribución X S.A.",
  "deliveriesInfo":[
     {
        "key":"0",
        "deliveryid":1000000,
        "status":"Pendiente de planificar",
        "customerName":"Martin",
        "customerSurname":"Sarubbi",
        "customerAddress":"Serrano 557",
        "customerDni":"33944674",
        "customerTelephone":"2719414137",
        "customerLongitude":-58.4491481,
        "customerLatitude":-34.5977777,
        "customerDistrict":"Villa Crespo",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Aire Acondicionado Split Candy CY3400FC - 3000F",
        "productCategory":"Heladera",
        "productId":"160841",
        "productWeight":130,
        "productWidth":91.2,
        "productHeight":179,
        "productLength":73.8,
        "productStackability":false,
        "productFragility":false,
        "searchField":"Aire Acondicionado Split Candy CY3400FC - 3000F,160841,Villa Crespo,Ciudad de Buenos Aires",
        "checkedForPlanning":true,
        "initialLatitude": -34.5977777,
        "initialLongitude": -58.4491481
     },
     {
        "key":"1",
        "deliveryid":1000001,
        "status":"Pendiente de planificar",
        "customerName":"Juan",
        "customerSurname":"Rodriguez",
        "customerAddress":"Medina 631",
        "customerDni":"34304059",
        "customerTelephone":"3435620199",
        "customerLongitude":-58.4847839,
        "customerLatitude":-34.6427886,
        "customerDistrict":"Parque Avellaneda",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Freezer Gafa Eternity L290 AB 285Lt",
        "productCategory":"Heladera",
        "productId":"161088",
        "productWeight":47,
        "productWidth":61.4,
        "productHeight":142.7,
        "productLength":62.1,
        "productStackability":true,
        "productFragility":false,
        "searchField":"Freezer Gafa Eternity L290 AB 285Lt,161088,Parque Avellaneda,Ciudad de Buenos Aires",
        "checkedForPlanning":true
     },
     {
        "key":"2",
        "deliveryid":1000002,
        "status":"Pendiente de planificar",
        "customerName":"Joaquín",
        "customerSurname":"Perez",
        "customerAddress":"Nogoyá 3132",
        "customerDni":"27045921",
        "customerTelephone":"5408152148",
        "customerLongitude":-58.4927018,
        "customerLatitude":-34.6039772,
        "customerDistrict":"Villa del Parque",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Smart TV 4K UHD Samsung 65\" UN65AU7000",
        "productCategory":"TV",
        "productId":"502158",
        "productWeight":20.9,
        "productWidth":144.9,
        "productHeight":9.6,
        "productLength":28.2,
        "productStackability":false,
        "productFragility":false,
        "searchField":"Smart TV 4K UHD Samsung 65\" UN65AU7000,502158,Villa del Parque,Ciudad de Buenos Aires",
        "checkedForPlanning":true
     },
     {
        "key":"3",
        "deliveryid":1000005,
        "status":"Pendiente de planificar",
        "customerName":"Pablo",
        "customerSurname":"Gonzalez",
        "customerAddress":"Sta. Magdalena 377",
        "customerDni":"15673490",
        "customerTelephone":"7387098113",
        "customerLongitude":-58.3834447,
        "customerLatitude":-34.6471401,
        "customerDistrict":"Barracas",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Panel De Tv 128 Tabaco",
        "productCategory":"Mueble",
        "productId":"1490453",
        "productWeight":39,
        "productWidth":138,
        "productHeight":12,
        "productLength":47,
        "productStackability":true,
        "productFragility":false,
        "searchField":"Panel De Tv 128 Tabaco,1490453,Barracas,Ciudad de Buenos Aires",
        "checkedForPlanning":true
     },
     {
        "key":"4",
        "deliveryid":1000006,
        "status":"Pendiente de planificar",
        "customerName":"Martin",
        "customerSurname":"Sarubbi",
        "customerAddress":"Serrano 557",
        "customerDni":"33944674",
        "customerTelephone":"2719414137",
        "customerLongitude":-58.4491481,
        "customerLatitude":-34.5977777,
        "customerDistrict":"Villa Crespo",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Aire Acondicionado Split Candy CY3400FC - 3000F",
        "productCategory":"Heladera",
        "productId":"160841",
        "productWeight":130,
        "productWidth":91.2,
        "productHeight":179,
        "productLength":73.8,
        "productStackability":false,
        "productFragility":false,
        "searchField":"Aire Acondicionado Split Candy CY3400FC - 3000F,160841,Villa Crespo,Ciudad de Buenos Aires",
        "checkedForPlanning":true
     },
     {
        "key":"5",
        "deliveryid":1000036,
        "status":"Pendiente de planificar",
        "customerName":"Olivia",
        "customerSurname":"Candia",
        "customerAddress":"Sta. Catalina 1522",
        "customerDni":"23000232",
        "customerTelephone":"4820493276",
        "customerLongitude":-58.4228897,
        "customerLatitude":-34.6543561,
        "customerDistrict":"Nueva Pompeya",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Tostadora Eléctrica Atma To8020i 700w 7 Niveles Full",
        "productCategory":null,
        "productId":"94TO8020I",
        "productWeight":"",
        "productWidth":18.01,
        "productHeight":16.03,
        "productLength":39.37,
        "productStackability":false,
        "productFragility":false,
        "searchField":"Tostadora Eléctrica Atma To8020i 700w 7 Niveles Full,94TO8020I,Nueva Pompeya,Ciudad de Buenos Aires",
        "checkedForPlanning":true
     },
     {
      "key":"6",
      "deliveryid":1000037,
      "status":"Pendiente de planificar",
      "customerName":"Olivia",
      "customerSurname":"Candia",
      "customerAddress":"Sta. Catalina 1522",
      "customerDni":"23000232",
      "customerTelephone":"4820493276",
      "customerLongitude":-58.4228897,
      "customerLatitude":-34.6543561,
      "customerDistrict":"Nueva Pompeya",
      "customerProvince":"Ciudad de Buenos Aires",
      "productName":"Tostadora Eléctrica Atma To8020i 700w 7 Niveles Full",
      "productCategory":null,
      "productId":"94TO8020I",
      "productWeight":"",
      "productWidth":18.01,
      "productHeight":16.03,
      "productLength":39.37,
      "productStackability":false,
      "productFragility":false,
      "searchField":"Tostadora Eléctrica Atma To8020i 700w 7 Niveles Full,94TO8020I,Nueva Pompeya,Ciudad de Buenos Aires",
      "checkedForPlanning":true
   },
   {
    "key":"7",
    "deliveryid":1000052,
    "status":"Pendiente de planificar",
    "customerName":"Joaquín",
    "customerSurname":"Perez",
    "customerAddress":"Nogoyá 3132",
    "customerDni":"27045921",
    "customerTelephone":"5408152148",
    "customerLongitude":-58.4927018,
    "customerLatitude":-34.6039772,
    "customerDistrict":"Villa del Parque",
    "customerProvince":"Ciudad de Buenos Aires",
    "productName":"Smart TV 4K UHD Samsung 65\" UN65AU7000",
    "productCategory":"TV",
    "productId":"502158",
    "productWeight":20.9,
    "productWidth":144.9,
    "productHeight":9.6,
    "productLength":28.2,
    "productStackability":false,
    "productFragility":false,
    "searchField":"Smart TV 4K UHD Samsung 65\" UN65AU7000,502158,Villa del Parque,Ciudad de Buenos Aires",
    "checkedForPlanning":true
  },
  {
    "key":"8",
    "deliveryid":1000052,
    "status":"Pendiente de planificar",
    "customerName":"Joaquín",
    "customerSurname":"Perez",
    "customerAddress":"Nogoyá 3132",
    "customerDni":"27045921",
    "customerTelephone":"5408152148",
    "customerLongitude":-58.4927018,
    "customerLatitude":-34.6039772,
    "customerDistrict":"Villa del Parque",
    "customerProvince":"Ciudad de Buenos Aires",
    "productName":"Smart TV 4K UHD Samsung 65\" UN65AU7000",
    "productCategory":"TV",
    "productId":"502158",
    "productWeight":20.9,
    "productWidth":144.9,
    "productHeight":9.6,
    "productLength":28.2,
    "productStackability":false,
    "productFragility":false,
    "searchField":"Smart TV 4K UHD Samsung 65\" UN65AU7000,502158,Villa del Parque,Ciudad de Buenos Aires",
    "checkedForPlanning":true
  }
  ],
  "trucksInfo":[
     {
        "key":"0",
        "licensePlate":"AB123CD",
        "truckDescription":"CAMIONAZO FDA$@",
        "width":280,
        "length":500,
        "height":240,
        "maximumWeightCapacity":3000,
        "searchField":"undefined,AB123CD",
        "checkedForPlanning":true
     },
     {
        "key":"1",
        "licensePlate":"AS432FS",
        "truckDescription":"CAMIONAZO FDA$@",
        "width":270,
        "length":480,
        "height":250,
        "maximumWeightCapacity":2800,
        "searchField":"undefined,AS432FS",
        "checkedForPlanning":false
     }
  ]
}


function FollowUpScreen() {
  
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
  const [waypoints, setWaypoints] = useState([{}]);
  const [planningMarkers, setPlanningMarkers] = useState([{}]);
  const [loaded, setLoaded] = useState(false);
  const [markers, setMarkers] = useState([{ coordinates: { latitude: 37.78383, longitude: -122.405766 } }]);
  
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
    startPlanning();
  }, []);

  async function startPlanning() {
    try {
      console.log("Llegue0")
      let response = await planningAlgorithm(planningData);
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
    console.log(coordinate)
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

    setWaypoints(waypointsArray)

  }

  console.log(waypoints)
  console.log(originLocation)


  function uiCheckPressHandler(item) {
    let newDeliveries = [...deliveries];
    for(const key in deliveries) {
      if(item.key == newDeliveries[key].key) {
        newDeliveries[key].uiCheck = !item.uiCheck
      }
    }
    setDeliveries(newDeliveries);
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
    <View style={{flex: 1}}>
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
                destination={originLocation}
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
})

export default FollowUpScreen;