import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { CheckBox, Icon, Tooltip } from '@rneui/themed';
import { getLocationDetailsFromGoogleMapsJSON } from '../../util/location';
import { changeDeliveryDate } from '../../util/http';
import Input from '../../components/Input';
import DatePicker from 'react-native-date-picker';


function DeliveriesDetailScreen(props, { navigation }) {
  const [marker, setMarker] = useState({ 
    latitude: props.route.params.itemData.customerLatitude, 
    longitude: props.route.params.itemData.customerLongitude,
    customerAddress: props.route.params.itemData.customerAddress,
    customerDistrict: props.route.params.itemData.customerDistrict,
    customerProvince: props.route.params.itemData.customerProvince,
    customerName: props.route.params.itemData.customerName,
    customerSurname: props.route.params.itemData.customerSurname,
    customerDepartment: props.route.params.itemData.customerDepartment,
    dni: props.route.params.itemData.customerDni,
    telephone: props.route.params.itemData.customerTelephone,
    productId: props.route.params.itemData.productId,
    productName: props.route.params.itemData.productName,
    productCategory: props.route.params.itemData.productCategory,
    productWeight: props.route.params.itemData.productWeight,
    productWidth: props.route.params.itemData.productWidth,
    productHeight: props.route.params.itemData.productHeight,
    productLength: props.route.params.itemData.productLength,
    productStackability: props.route.params.itemData.productStackability,
    productFragility: props.route.params.itemData.productFragility,
    productRotability: props.route.params.itemData.productRotability,
    deliveryid: props.route.params.itemData.deliveryid,
    status: props.route.params.itemData.status,
    deliveryDate: props.route.params.itemData.deliveryDate,
    latitudeDelta: 0.0059,
    longitudeDelta: 0.0059,
  });
  const [date, setDate] = useState(new Date( props.route.params.itemData.deliveryDate.split('/')[2], props.route.params.itemData.deliveryDate.split('/')[1] - 1, props.route.params.itemData.deliveryDate.split('/')[0]));
  const [dateString, setDateString] = useState(props.route.params.itemData.deliveryDate);
  const [open, setOpen] = useState(false);
  const [fragileTooltipOpen, setFragileTooltipOpen] = useState(false); 
  const [stackabilityTooltipOpen, setStackabilityTooltipOpen] = useState(false);
  const [rotabilityTooltipOpen, setRotableTooltipOpen] = useState(false);

  const mapRef = useRef(null);
  const [loaded, setLoaded] = useState(false)

  const onPress = (data, details) => {
    const locationDetails = getLocationDetailsFromGoogleMapsJSON(details);
    const customerDetails = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      customerAddress: data.structured_formatting.main_text,
      customerDistrict: locationDetails.district,
      customerProvince: locationDetails.province,
      productName: props.route.params.itemData.productName,
      customerName: props.route.params.itemData.customerName,
      customerSurname: props.route.params.itemData.customerSurname,
      customerDepartment: props.route.params.itemData.customerDepartment
    };
    setMarker(customerDetails);
  };

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }


  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: marker.latitude,
            longitude: marker.longitude,
            latitudeDelta: 0.1822,
            longitudeDelta: 0.0421
          }}
          ref={mapRef}
          onRegionChangeComplete={(region) => { 
            if (!loaded) { 
              if (region.latitude != marker.latitude || region.longitude != marker.longitude) {
                mapRef.current.animateToRegion(marker, 1)
              }
              setLoaded(true)
            } 
          }}
        >
          <Marker coordinate={{ latitude: marker.latitude, longitude: marker.longitude}}/>
        </MapView>
      </View>
      <ScrollView style={{width: '100%'}}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Cliente de la entrega nro. {marker.deliveryid}</Text>
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Nombre'
            placeholder='Nombre'
            textInputConfig={{
              editable: false,
              value: marker.customerName
            }}
            style={styles.allInputRow}
          />
          <Input
            label='Apellido'
            placeholder='Apellido'
            textInputConfig={{
              editable: false,
              value: marker.customerSurname
            }}
            style={styles.allInputRow}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='DNI'
            placeholder='DNI'
            textInputConfig={{
              editable: false,
              value: marker.dni
            }}
            style={styles.allInputRow}
          />
          <Input
            label='Teléfono'
            placeholder='Teléfono'
            textInputConfig={{
              editable: false,
              value: marker.telephone
            }}
            style={styles.allInputRow}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Dirección'
            placeholder='Dirección'
            textInputConfig={{
              editable: false,
              value: marker.customerAddress
            }}
            style={styles.allInputRow}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Partido/Comuna'
            placeholder='Partido/Comuna'
            textInputConfig={{
              editable: false,
              value: marker.customerDistrict
            }}
            style={styles.allInputRow}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Provincia'
            placeholder='Provincia'
            textInputConfig={{
              editable: false,
              value: marker.customerProvince
            }}
            style={styles.allInputRow}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Piso/Departamento'
            placeholder='-'
            textInputConfig={{
              editable: false,
              value: marker.customerDepartment
            }}
            style={styles.allInputRow}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Fecha de entrega'
            placeholder='dd/mm/yyyy'
            style={styles.allInputRow}
            textInputConfig={{
              editable: true,
              value: dateString
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
              setDateString([
                padTo2Digits(date.getDate()),
                padTo2Digits(date.getMonth() + 1),
                date.getFullYear(),
              ].join('/'))
              let delList = []
              delList.push({
                deliveryDate: [
                  padTo2Digits(date.getDate()),
                  padTo2Digits(date.getMonth() + 1),
                  date.getFullYear(),
                ].join('/'),
                deliveryId: marker.deliveryid
              })
              changeDeliveryDate(delList)
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Producto</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Estado: {marker.status}</Text>
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Código de barras'
            placeholder='Código de barras'
            textInputConfig={{
              editable: false,
              value: marker.productId.toString()
            }}
            style={styles.allInputRow}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Descripción'
            placeholder='Descripción'
            textInputConfig={{
              editable: false,
              value: marker.productName
            }}
            style={styles.allInputRow}
          />
        </View>
        {/*<View style={styles.inputRow}>
          <Input
            label='Categoría'
            placeholder='Categoría'
            textInputConfig={{
              editable: false,
              value: marker.productCategory
            }}
            style={styles.allInputRow}
          />
        </View*/}
        <View>
          <View style={styles.halfInputRow}>
            <Input
              label='Alto (cm)'
              placeholder='-'
              textInputConfig={{
                editable: false,
                value: marker.productHeight.toString()
              }}
              style={styles.allInputRow}
            />
            <Input
              label='Ancho (cm)'
              placeholder='-'
              textInputConfig={{
                editable: false,
                value: marker.productWidth.toString()
              }}
              style={styles.allInputRow}
            />
          </View>
          <View style={styles.halfInputRow}>
            <Input
              label='Largo (cm)'
              placeholder='-'
              textInputConfig={{
                editable: false,
                value: marker.productLength.toString()
              }}
              style={styles.allInputRow}
            />
            <Input
              label='Peso (kg)'
              placeholder='-'
              textInputConfig={{
                editable: false,
                value: marker.productWeight.toString()
              }}
              style={styles.allInputRow}
            />
          </View>
          <View style={styles.halfInputRow}>
            <View style={styles.checkBoxContainer}>
              <CheckBox
                center
                accessibilityRole='button'
                title="Frágil"
                checked={marker.productFragility}
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
                title="Apilable"
                checked={marker.productStackability}
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
                title="Rotable"
                checked={marker.productRotability}
              />
              <Tooltip
                visible={rotabilityTooltipOpen}
                onOpen={() => {
                  setRotableTooltipOpen(true);
                }}
                onClose={() => {
                  setRotableTooltipOpen(false);
                }}
                width={300}
                height={130}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  searchContainer: {
    width: '90%',
    position: 'absolute',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 4,
    borderRadius: 8,
    marginTop: 12
  },
  input: {
    borderColor: 'grey',
    borderWidth: 1,
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
  barcodeScanIcon: {
    marginTop: 25,
    marginLeft: 10,
  },
})

export default DeliveriesDetailScreen;