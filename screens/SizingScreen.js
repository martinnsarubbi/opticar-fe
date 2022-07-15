import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button'

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

  function submitHandler() {
    const productData = {
      productName: inputValues.productName,
      height: +inputValues.height,
      length: +inputValues.length,
      weight: +inputValues.weight,
      width: +inputValues.width,
      entryDate: new Date()
    }
  }

  return (
    <View>
      <Text style={styles.indications}>Nuevo producto</Text>
      <View style={styles.inputRow}>
        <Input
          label='Nombre del producto'
          style={styles.rowInput}
          textInputConfig={{
            onChangeText: inputChangedHandler.bind(this, 'productName'),
            value: inputValues['productName']
          }}
        />
      </View>
      <View style={styles.inputRow}>
        <Input label='Alto'
          textInputConfig={{
            keyboardType: 'decimal-pad',
            onChangeText: inputChangedHandler.bind(this, 'height'),
            value: inputValues['height']
          }}
        />
        <Input
          label='Ancho'
          textInputConfig={{
            keyboardType: 'decimal-pad',
            onChangeText: inputChangedHandler.bind(this, 'width'),
            value: inputValues['width']
          }}
        />
      </View>
      <View style={styles.inputRow}>
        <Input
          label='Largo'
          textInputConfig={{
            keyboardType: 'decimal-pad',
            onChangeText: inputChangedHandler.bind(this, 'length'),
            value: inputValues['length']
          }}
        />
        <Input
          label='Peso'
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
    fontSize: 18
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})