import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, Image, Pressable } from 'react-native';
import AddButton from '../../components/AddButton';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import SearchComponent from '../../components/SearchComponent';
import { fetchDeliveries } from '../../util/http';

function DeliveriesScreen({ navigation }) {

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const [deliveries, setDeliveries] = useState();
  const [markers, setMarkers] = useState([ { coordinates: { latitude: 37.78383, longitude: -122.405766 } } ]);
  const [searchText, setSearchText] = useState();
  const [flatItems, setFlatItems] = useState();
  const [loaded, setLoaded] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const unsuscribe = navigation.addListener("focus", () => {
      getDeliveries();
    });
    return unsuscribe;
  }, [navigation])
  
  function deliveriesPressHandler(itemData) {
    navigation.navigate('Detalle de entrega', { itemData })
  }

  useEffect(() => {
    getDeliveries();
  }, []);

  async function getDeliveries() {
    setIsFetching(true);
    try {
      const deliveries = await fetchDeliveries(true, true);

      const markers = [];
      for(const key in deliveries) {
        const coordinatesObj = {
          coordinates: {
            longitude: deliveries[key].customerLongitude,
            latitude: deliveries[key].customerLatitude,
          },
          name: deliveries[key].productName
        }
        markers.push(coordinatesObj);
      }

      const searchFilteredData = searchText
        ? deliveries.filter((x) =>
                x.searchField.toLowerCase().includes(searchText.toLowerCase())
          )
        : deliveries;

      setDeliveries(deliveries);
      setFlatItems(searchFilteredData)
      setMarkers(markers);

    } catch(error) {
      setError('No se pudieron obtener las entregas.')
    }
    setIsFetching(false);
  }

  useEffect(() => {
    async function getSearchFilterData() {
    const searchFilteredData = searchText
      ? deliveries.filter((x) =>
              x.searchField.toLowerCase().includes(searchText.toLowerCase())
        )
      : deliveries;
      setFlatItems(searchFilteredData)
    }
    getSearchFilterData();
  }, [searchText]);

   

  const renderItem = ({item}) => (
    <Pressable
    onPress={() => {
      deliveriesPressHandler(item);
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
        <Image 
          style={styles.imageStyle}
          source={require('../../assets/location.png')}
        />
      </View>
      <View style={styles.rowMiddle}>
        <Text style={styles.productText}>{item.productName}</Text>
        <Text numberOfLines={1} style={styles.locationText}>{item.customerDistrict}, {item.customerProvince}</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.volumeText}>{item.productHeight * item.productWidth * item.productLength / 1000000} m2</Text>
      </View>
    </Pressable>
  )

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
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
        <SearchComponent onSearchEnter={(newTerm) => {
          setSearchText(newTerm);
        }} />
        <FlatList
          data={flatItems}
          renderItem={renderItem}
          extraData={flatItems}
          keyExtractor={item => item.key}
        />
        <AddButton navigation={navigation} navigationScreen='Nueva entrega' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    height: 300
  },
  listContainer: {
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
  imageStyle: {
    height: 40,
    width: 40
  },
  productText: {
    fontWeight: 'bold'
  },
  locationText: {
    textAlign: 'left',
    color: 'grey'
  },
  volumeText: {
    textAlign: 'right',
  },
  pressed: {
    opacity: 0.75,
    borderRadius: 4,
    backgroundColor: 'red'
  },
  addPressed: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#76BA1B',
    width: 75,
    height: 75,
    borderRadius: 50,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
})
export default DeliveriesScreen;