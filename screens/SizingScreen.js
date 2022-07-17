import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button'
import { storeProduct } from '../util/http'

function SizingScreen() {
  const[inputValues, setInputValues] = useState({
    productName: '',
    height: '',
    length: '',
    weight: '',
    width: ''
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
    const productData = {
      productName: inputValues.productName,
      height: +inputValues.height,
      length: +inputValues.length,
      weight: +inputValues.weight,
      width: +inputValues.width,
      entryDate: new Date()
    };
    const id = await storeProduct(productData);
  }

  return (
    <View>
      <View style={styles.innerContainer}>
        <Text style={styles.indications}>Agregar nuevo producto</Text>
        <View style={styles.inputRow}>
          <Input
            label='Nombre del producto'
            placeholder='Ej.: Heladera Electrolux F7200SUS...'
            style={styles.rowInput}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'productName'),
              value: inputValues['productName']
            }}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Alto (cm)'
            placeholder='Ej.: 10 cm'
            textInputConfig={{
              keyboardType: 'decimal-pad',
              onChangeText: inputChangedHandler.bind(this, 'height'),
              value: inputValues['height']
            }}
          />
          <Input
            label='Ancho (cm)'
            placeholder='Ej.: 20,33 cm'
            textInputConfig={{
              keyboardType: 'decimal-pad',
              onChangeText: inputChangedHandler.bind(this, 'width'),
              value: inputValues['width']
            }}
          />
        </View>
        <View style={styles.inputRow}>
          <Input
            label='Largo (cm)'
            placeholder='Ej.: 5,3 cm'
            textInputConfig={{
              keyboardType: 'decimal-pad',
              onChangeText: inputChangedHandler.bind(this, 'length'),
              value: inputValues['length']
            }}
          />
          <Input
            label='Peso (kg)'
            placeholder='Ej.: 15,51 kg'
            textInputConfig={{
              keyboardType: 'decimal-pad',
              onChangeText: inputChangedHandler.bind(this, 'weight'),
              value: inputValues['weight']
            }}
          />
        </View>
        <View>
          <Button style={styles.button} onPress={submitHandler}>
            Agregar
          </Button>
        </View>
      </View>
    </View>
  );
}

export default SizingScreen;

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
  },
  indications: {
    color: 'grey',
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center'
  }
})