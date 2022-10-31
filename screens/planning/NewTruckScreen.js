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
import { storeTruck } from '../../util/http';
import DatePicker from 'react-native-date-picker';

LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.']);

function NewTruckScreen({ navigation }) {

  const [loaded, setLoaded] = useState(false)
  const [inputValues, setInputValues] = useState({ 
    licensePlate:'',
    description: '',
    width: '',
    maximumWeightCapacity: '',
    height: '',
    length: '',
    driverName: '',
    driverSurname: '',
    dni: ''
  });

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputValues((curInputValues) => {
      return {
        ...curInputValues,
        [inputIdentifier]: enteredValue
      };
    });
  }

  async function submitHandler() {
    const id = await storeTruck(inputValues);
    navigation.navigate('Planificación');
  }


  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Datos del transporte</Text>
      </View>
      <View style={styles.inputRow}>
        <Input
          label='Patente'
          placeholder='Patente'
          style={styles.allInputRow}
          textInputConfig={{
            onChangeText: inputChangedHandler.bind(this, 'licensePlate'),
            value: inputValues.licensePlate
          }}
        />
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

        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Datos del furgón</Text>
        </View>

        <View style={styles.halfInputRow}>
          <Input
            label='Alto (cm)'
            placeholder='Alto'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'height'),
              value: inputValues.height
            }}
          />
          <Input
            label='Ancho (cm)'
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
            label='Largo (cm)'
            placeholder='Largo'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'length'),
              value: inputValues.length
            }}
          />
          <Input
            label='Peso soportado (kg)'
            placeholder='Peso'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'maximumWeightCapacity'),
              value: inputValues.maximumWeightCapacity
            }}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Datos del chofer</Text>
        </View>

        <View style={styles.halfInputRow}>
          <Input
            label='Nombre'
            placeholder='Nombre'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'driverName'),
              value: inputValues.driverName
            }}
          />
          <Input
            label='Apellido'
            placeholder='Apellido'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'driverSurname'),
              value: inputValues.driverSurname
            }}
          />
        </View>
        <View style={styles.halfInputRow}>
          <Input
            label='DNI'
            placeholder='DNI'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'dni'),
              value: inputValues.dni
            }}
          />
        </View>

      <Button style={styles.button} onPress={submitHandler}>
        Agregar
      </Button>
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
    padding: 6,
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
    padding: 6,
  },
  checkBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  button: {
    position: 'absolute',
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

export default NewTruckScreen;