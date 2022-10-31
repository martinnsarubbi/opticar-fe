import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { CheckBox, Icon, Tooltip } from '@rneui/themed';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../../environment';
import { getLocationDetailsFromGoogleMapsJSON } from '../../util/location';
import Input from '../../components/Input';
import Button from '../../components/Button'
import { LogBox } from 'react-native';
import { storeDelivery, fetchDeliveries } from '../../util/http';
import DatePicker from 'react-native-date-picker';

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.']);

function NewDeliveryScreen({ navigation }) {

  const [currRegion, setCurrRegion] = useState({
    latitude: -34.604593,
    longitude: -58.428880,
    latitudeDelta: 0.1822,
    longitudeDelta: 0.0421,
  })
  const mapRef = useRef(null);
  const [loaded, setLoaded] = useState(false)
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  const [inputValues, setInputValues] = useState({ 
    latitude: 0, 
    longitude: 0,
    address: '',
    description: '',
    neighborhood: '',
    province: '',
    department: '',
    name: '',
    surname: '',
    dni: '',
    telephone: '',
    deliveryDate: '',
    barcode: '',
    description: '',
    category: '',
    weight: '',
    width: '',
    height: '',
    large: '',
    stackability: false,
    fragility: false,
    rotability: false,
    screen: 'NewDeliveryScreen'
  });
  const [fragileTooltipOpen, setFragileTooltipOpen] = useState(false); 
  const [stackabilityTooltipOpen, setStackabilityTooltipOpen] = useState(false); 
  const [rotableTooltipOpen, setRotableTooltipOpen] = useState(false);

  useEffect(() => {
    async function updateProduct() {
      try {
        let deliveries = await fetchDeliveries(true, true);
        const searchFilteredData = inputValues.barcode
          ? deliveries.filter((x) =>
                  x.productId.includes(inputValues.barcode)
            )
          : null;
        if(searchFilteredData != null) {
          if(searchFilteredData[0] != null) {
            setInputValues((curInputValues) => ({
              ...curInputValues,
              description: searchFilteredData[0].productName,
              category: searchFilteredData[0].productCategory,
              weight: searchFilteredData[0].productWeight.toString(),
              width: searchFilteredData[0].productWidth.toString(),
              height: searchFilteredData[0].productHeight.toString(),
              large: searchFilteredData[0].productLength.toString(),
              stackability: searchFilteredData[0].productStackability,
              fragility: searchFilteredData[0].productFragility,
              rotability: searchFilteredData[0].productRotability
            }))
          }
        }
      } catch(error) {
        console.log(error)
      }
    }
    updateProduct();
  }, [inputValues.barcode]);

  const onPress = (data, details) => {    
    const locationDetails = getLocationDetailsFromGoogleMapsJSON(details);

    setCurrRegion({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      latitudeDelta: 0.0059,
      longitudeDelta: 0.0059,
    })

    setInputValues((curInputValues) => ({
      ...curInputValues,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      address: data.structured_formatting.main_text,
      neighborhood: locationDetails.district,
      province: locationDetails.province,
    }))
  };

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputValues((curInputValues) => {
      return {
        ...curInputValues,
        [inputIdentifier]: enteredValue
      };
    });
  }

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  function barcodePressHandler() {
    navigation.navigate('Código de barras', { inputValues } );
  }

  async function submitHandler() {
    console.log(inputValues)
    const id = await storeDelivery(inputValues);
    navigation.navigate('Entregas');
  }


  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currRegion.latitude,
            longitude: currRegion.longitude,
            latitudeDelta: currRegion.latitudeDelta,
            longitudeDelta: currRegion.longitudeDelta,
          }}
          ref={mapRef}
          onRegionChangeComplete={(region) => { 
            if (!loaded) { 
              if (region.latitude != currRegion.latitude || region.longitude != currRegion.longitude) {
                mapRef.current.animateToRegion(currRegion, 1)
              }
              setLoaded(true)
            } 
          }}
        >
          {inputValues.latitude != 0 &&
            <Marker coordinate={{ latitude: inputValues.latitude, longitude: inputValues.longitude}}/>
          }
        </MapView>
      </View>
      <ScrollView style={{width: '100%'}} keyboardShouldPersistTaps='always' listViewDisplayed={false} >
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Datos del Cliente</Text>
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Nombre'
            placeholder='Nombre'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'name'),
              value: inputValues.name
            }}
          />
          <Input
            label='Apellido'
            placeholder='Apellido'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'surname'),
              value: inputValues.surname
            }}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='DNI'
            placeholder='DNI'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'dni'),
              value: inputValues.dni
            }}
          />
          <Input
            label='Teléfono'
            placeholder='Teléfono'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'telephone'),
              value: inputValues.telephone
            }}
          />
        </View>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dirección</Text>
            <GooglePlacesAutocomplete
              placeholder='Buscar dirección'
              onPress={onPress}
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
          </View>
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Partido/Comuna'
            placeholder='Partido/Comuna'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'neighborhood'),
              value: inputValues.neighborhood
            }}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Provincia'
            placeholder='Provincia'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'province'),
              value: inputValues.province
            }}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Piso/Departamento'
            placeholder='Ingrese piso y/o departamento'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'department'),
              value: inputValues.department
            }}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Fecha de entrega'
            placeholder='dd/mm/yyyy'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, inputValues.deliveryDate),
              value: inputValues.deliveryDate
            }}
          />
          <Icon
              name='calendar'
              type='material-community'
              style={styles.barcodeScanIcon}
              size={30}
              color='grey'
              onPress={() => setOpen(true)}
            />
          <DatePicker
            modal
            open={open}
            mode="date"
            date={date}
            onConfirm={(date) => {
              setOpen(false)
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
              setOpen(false)
            }}
          />
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Datos del Producto</Text>
        </View>

        <View style={styles.halfInputRow}>
          <Input
            label='Código de barras'
            placeholder='Ingrese el código de barras...'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'barcode'),
              value: inputValues.barcode
            }}
          />
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
        <View style={styles.inputRow}>
          <Input
            label='Descripción'
            placeholder='Descripción'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'description'),
              value: inputValues.description
            }}
          />
        </View>
        {/*<View style={styles.inputRow}>
          <Input
            label='Categoría  - Opcional'
            placeholder='Categoría'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'category'),
              value: inputValues.category
            }}
          />
          </View>*/}
        <View>
          <View style={styles.halfInputRow}>
            <Input
              label='Alto (cm)  - Opcional'
              placeholder='Alto'
              style={styles.allInputRow}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, 'height'),
                value: inputValues.height
              }}
            />
            <Input
              label='Ancho (cm)  - Opcional'
              placeholder='Ancho'
              style={styles.allInputRow}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, 'width'),
                value: inputValues.width
              }}
            />
          </View>
          <View style={styles.halfInputRow}>
            <Input
              label='Largo (cm)  - Opcional'
              placeholder='Largo'
              style={styles.allInputRow}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, 'large'),
                value: inputValues.large
              }}
            />
            <Input
              label='Peso (kg)  - Opcional'
              placeholder='Peso'
              style={styles.allInputRow}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, 'weight'),
                value: inputValues.weight
              }}
            />
          </View>
          <View style={styles.halfInputRow}>
            <View style={styles.checkBoxContainer}>
              <CheckBox
                center
                accessibilityRole='button'
                title="Frágil -       Opcional"
                checked={inputValues.fragility}
                onPress={() => setInputValues((curInputValues) => ({
                    ...curInputValues,
                    fragility: !inputValues.fragility
                }))}
              />
              <Tooltip
                visible={fragileTooltipOpen}
                onOpen={() => {
                  setFragileTooltipOpen(true);
                }}
                onClose={() => {
                  setFragileTooltipOpen(false);
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
                  color='grey'
                  type='entypo'
                />
                          
              </Tooltip>
            </View>
            <View style={styles.checkBoxContainer}>
              <CheckBox
                center
                accessibilityRole='button'
                title="Apilable  - Opcional"
                checked={inputValues.stackability}
                onPress={() => setInputValues((curInputValues) => ({
                    ...curInputValues,
                    stackability: !inputValues.stackability
                }))}
              />
              <Tooltip
                visible={stackabilityTooltipOpen}
                onOpen={() => {
                  setStackabilityTooltipOpen(true);
                }}
                onClose={() => {
                  setStackabilityTooltipOpen(false);
                }}
                width={300}
                height={130}
                backgroundColor='white'
                overlayColor='#93a2b899'
                popover={<Text>
                  Si es un producto que puede apilar otro producto igual a sí mismo, marcá esta opción.
                  Tené en cuenta que el producto debe apilarse sobre otro producto igual a él sin romper al producto de abajo.
                </Text>}
              >
                <Icon
                  name='info-with-circle'
                  color='grey'
                  type='entypo'
                />
              </Tooltip>
            </View>
          </View>
          <View style={styles.halfInputRow}>
            <View style={styles.checkBoxContainer}>
              <CheckBox
                center
                accessibilityRole='button'
                title="Rotable -       Opcional"
                checked={inputValues.rotability}
                onPress={() => setInputValues((curInputValues) => ({
                    ...curInputValues,
                    rotability: !inputValues.rotability
                }))}
              />
              <Tooltip
                visible={rotableTooltipOpen}
                onOpen={() => {
                  setRotableTooltipOpen(true);
                }}
                onClose={() => {
                  setRotableTooltipOpen(false);
                }}
                width={300}
                height={100}
                backgroundColor='white'
                overlayColor='#93a2b899'
                popover={<Text>
                  Elegí esta opción si el producto puede apoyarse sobre cualquiera de sus caras dentro del transporte. En el caso de que el producto no pueda
                  posicionarse lateralmente, no marques esta opción.
                </Text>}
              >
                <Icon
                  name='info-with-circle'
                  color='grey'
                  type='entypo'
                />
                          
              </Tooltip>
            </View>
          </View>
        </View>
        <Button style={styles.button} onPress={submitHandler}>
          Agregar
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 0,
    flex: 1
  },
  label: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 4,
    fontWeight: 'bold'
  },
  input: {
    borderColor: 'grey',
    borderWidth: 1,
  },
  googleSearchInput: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    color: 'black'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    height: 250,
    width: '100%'
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    padding: 6
  },
  allInputRow: {
    flex: 1,
  },
  sectionTitle: {
    color: 'grey',
    fontSize: 22,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  halfInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    padding: 6
  },
  checkBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
    bottom: 40,
    paddingTop:60,
    paddingHorizontal: 20
  },
  barcodeScanIcon: {
    marginTop: 25,
    marginLeft: 10,
  },
})

export default NewDeliveryScreen;