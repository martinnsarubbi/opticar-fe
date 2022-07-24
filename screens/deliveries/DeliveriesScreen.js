import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import SearchComponent from '../../components/SearchComponent';
import { fetchDeliveries } from '../../util/http';

function DeliveriesScreen({ navigation }) {

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const [deliveries, setDeliveries] = useState();
  const [markers, setMarkers] = useState([ { coordinates: { latitude: 37.78383, longitude: -122.405766 } } ]);
  const [searchText, setSearchText] = useState();
  const [flatItems, setFlatItems] = useState();
  
  function deliveriesPressHandler(itemData) {
    navigation.navigate('Detalle de entrega', { itemData })
  }
  

  useEffect(() => {
    async function getDeliveries() {
      setIsFetching(true);
      try {
        const deliveries = await fetchDeliveries();

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
    getDeliveries();
  }, []);

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
        <Text style={styles.locationText}>{item.customerDistrict}, {item.customerProvince}</Text>
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
            initialRegion={{
              latitude: -34.604593,
              longitude: -58.428880,
              latitudeDelta: 0.1822,
              longitudeDelta: 0.0421,
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
    textAlign: 'right',
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
})
export default DeliveriesScreen;