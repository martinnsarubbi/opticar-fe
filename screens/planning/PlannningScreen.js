import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Icon, Tooltip } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';

function PlanningScreen() {

  const [date, setDate] = useState(new Date());
  const [markers, setMarkers] = useState([ { coordinates: { latitude: 37.78383, longitude: -122.405766 } } ]);
  const [loaded, setLoaded] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [deliveryTooltipOpen, setDeliveryTooltipOpen] = useState(false)
  const [truckTooltipOpen, setTruckTooltipOpen] = useState(false)
  const mapRef = useRef(null);
  const [inputValues, setInputValues] = useState({ 
    deliveryDate: ''
  });

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
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
        <View style={styles.trucksContainer}>
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
            <Text style={styles.dtValue}>0</Text>
          </View>
        </View>
        <View style={styles.deliveriesContainer}>
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
            <Text style={styles.dtValue}>0</Text>
          </View>
        </View>
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
  }
})

export default PlanningScreen;