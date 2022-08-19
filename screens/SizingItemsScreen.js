import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { Chip, Icon } from '@rneui/themed';
import Input from '../components/Input';
import { useState, useEffect } from 'react';
import SearchComponent from '../components/SearchComponent';
import { fetchDeliveries } from '../util/http';
import AddButton from '../components/AddButton';

function SizingItemsScreen({ navigation, route }) {

  const [withoutSizingChip, setWithoutSizingChip] = useState('solid');
  const [seeAllChip, setSeeAllChip] = useState('outline');
  const [flatItems, setFlatItems] = useState();
  const [searchText, setSearchText] = useState('');
  const [seeAllDeliveries, setSeeAllDeliveries] = useState();
  const [withoutSizingDeliveries, setWithoutSizingDeliveries] = useState();
  const [deliveries, setDeliveries] = useState();
  const [error, setError] = useState();
  const [inputValues, setInputValues] = useState({ barcode: '', originScreen: 'SizingItemsScreen'});

  useEffect(() => {
    async function getDeliveries() {
      try {
        let deliveries = await fetchDeliveries(true, true);
        const productIds = deliveries.map(o => o.productId)
        deliveries = deliveries.filter(({productId}, index) => !productIds.includes(productId, index + 1))

        setSeeAllDeliveries(deliveries);
        setWithoutSizingDeliveries(deliveries.filter((obj) => obj.status === 'Pendiente de dimensionar'))
        setDeliveries(deliveries.filter((obj) => obj.status === 'Pendiente de dimensionar'))
        setFlatItems(deliveries.filter((obj) => obj.status === 'Pendiente de dimensionar'))

      } catch(error) {
        setError('No se pudieron obtener las entregas.')
      }
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

  useEffect(() => {
    async function getBarcodeOnSearchField() {
      setSearchText(route?.params?.navigationParams)

    }
    getBarcodeOnSearchField();
  }, [route?.params?.navigationParams]);

  

  

  function barcodePressHandler() {
    navigation.navigate('Código de barras', { searchText });
  }

  function withoutSizingChipPressHandler() {
    setSeeAllChip('outline')
    setWithoutSizingChip('solid')
    setFlatItems(withoutSizingDeliveries)
    setDeliveries(withoutSizingDeliveries)
  }

  function seeAllChipPressHandler() {
    setSeeAllChip('solid')
    setWithoutSizingChip('outline')
    setFlatItems(seeAllDeliveries)
    setDeliveries(seeAllDeliveries)
  }

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
            source={require('../assets/box.png')}
          />
        </View>
        <View style={styles.rowMiddle}>
          <Text style={styles.productText}>{item.productName}</Text>
        </View>
        <View style={styles.rowRight}>
          <Text style={styles.volumeText}>{(item.productHeight * item.productWidth * item.productLength / 1000000).toFixed(2)} m2</Text>
        </View>
      </Pressable>
  )

  return (
    <View style={styles.container}>
      <View style={styles.contentView}>
        <View style={styles.chipContainer}>
          <Chip title="Sin dimensionar" type={withoutSizingChip} containerStyle={styles.chipView} onPress={() => withoutSizingChipPressHandler() } />
          <Chip title="Ver todos" type={seeAllChip} containerStyle={styles.chipView} onPress={() => seeAllChipPressHandler() } />
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center' }}>
        <View style={{width: 350}}>
          <SearchComponent onSearchEnter={(newTerm) => {
              setSearchText(newTerm);
            }} />
        </View>
        <Pressable
          onPress={() => {
            barcodePressHandler();
          }}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Icon
            name='barcode-scan'
            type='material-community'
            style={styles.barcodeScanIcon}
            size={30}
            color='grey'
          />
        </Pressable>
      </View>
      <FlatList
        data={flatItems}
        renderItem={renderItem}
        extraData={flatItems}
        keyExtractor={item => item.key}
      />
      <AddButton navigation={navigation} navigationScreen='Dimensionamiento de nuevo producto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  chipView: {
    justifyContent: 'center',
    marginVertical: 5,
    marginHorizontal: 2
  },
  pressed: {
    opacity: 0.75,
    borderRadius: 4,
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
    width: '69%',
    justifyContent: 'center'
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
    color: 'grey',
  },
  volumeText: {
    textAlign: 'right',
  },
});

export default SizingItemsScreen;