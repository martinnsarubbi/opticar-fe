import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, Pressable } from 'react-native';
import { CheckBox } from '@rneui/themed';
import SearchComponent from '../../components/SearchComponent';
import { fetchDeliveries } from '../../util/http';
import Button from '../../components/Button'
import AddButton from '../../components/AddButton';

function TruckScreen({ navigation, route }) {

  const [trucks, setTrucks] = useState();
  const [searchText, setSearchText] = useState();
  const [flatItems, setFlatItems] = useState();

  useEffect(() => {
    const unsuscribe = navigation.addListener("focus", () => {
      getTrucks(route.params.trucks);
    });
    return unsuscribe;
  }, [navigation])
  
  function trucksPressHandler(itemData) {
    navigation.navigate('Detalle del transporte', { itemData })
  }

  useEffect(() => {
    getTrucks();
  }, []);


  async function getTrucks(trucks) {
    try {
      const searchFilteredData = searchText
        ? trucks.filter((x) =>
                x.searchField.toLowerCase().includes(searchText.toLowerCase())
          )
        : trucks;

      setTrucks(trucks);
      setFlatItems(searchFilteredData)

    } catch(error) {
      console.log('No se pudieron obtener las entregas.')
    }
  }

  useEffect(() => {
    async function getSearchFilterData() {
    const searchFilteredData = searchText
      ? trucks.filter((x) =>
              x.searchField.toLowerCase().includes(searchText.toLowerCase())
        )
      : trucks;
      setFlatItems(searchFilteredData)
    }
    getSearchFilterData();
  }, [searchText]);

  function addAllPressHandler() {
    let newTrucks = [...trucks];
    for(const key in newTrucks) {
      newTrucks[key].checkedForPlanning = true
    }
    setTrucks(newTrucks);
  }

  function removeAllPressHandler() {
    let newTrucks = [...trucks];
    for(const key in newTrucks) {
      newTrucks[key].checkedForPlanning = false
    }
    setTrucks(newTrucks);
  }

  function removeTruckPressHandler(item) {
    let newTrucks = [...trucks];
    for(const key in newTrucks) {
      if(item.licensePlate == newTrucks[key].licensePlate) {
        newTrucks[key].checkedForPlanning = !item.checkedForPlanning
      }
    }
    setTrucks(newTrucks);
  }

  const submitHandler = () => {
    navigation.navigate('Planificación', { trucks });
  }
   

  const renderItem = ({item}) => (
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
      <View style={styles.listContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Pressable
            onPress={() => {
              addAllPressHandler();
            }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? '#e2e2e2'
                  : 'white',
                opacity: pressed
                  ? 0.75 : 1
              },
              styles.addRemoveAll
            ]}
          >
            <Text>Seleccionar todos</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              removeAllPressHandler();
            }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? '#e2e2e2'
                  : 'white',
                opacity: pressed
                  ? 0.75 : 1
              },
              styles.addRemoveAll
            ]}
          >
            <Text>Remover todos</Text>
          </Pressable>
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
        <AddButton navigation={navigation} navigationScreen='Nuevo transporte' />
        <Button style={styles.button} onPress={submitHandler}>
          OK
        </Button>
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
    height: 300
  },
  listContainer: {
    flex: 1,
    alignItems: 'center',
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
  addRemoveAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '40%',
    borderRadius: 30,
    padding: 10,
    margin: 10,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
    paddingRight: 80,
    position: 'absolute',
    bottom: 30,
  },
})
export default TruckScreen;