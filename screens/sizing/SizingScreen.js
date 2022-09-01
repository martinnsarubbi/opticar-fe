import React, { useEffect, useState } from 'react';
import { CheckBox, Icon, Tooltip } from '@rneui/themed';
import { View, Text, StyleSheet, Pressable  } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button'
import { storeProduct } from '../../util/http';


function SizingScreen({ navigation, route }) {
  const[inputValues, setInputValues] = useState({
    barcode: (route.params?.itemData?.productId.length > 1) ? route.params?.itemData?.productId : '',
    productName: (route.params?.itemData?.productName.length > 1) ? route.params?.itemData?.productName : '',
    height: (route.params?.itemData?.productHeight > 0) ? route.params?.itemData?.productHeight.toString() : '',
    length: (route.params?.itemData?.productLength > 0) ? route.params?.itemData?.productLength.toString() : '',
    weight: (route.params?.itemData?.productWeight > 0) ? route.params?.itemData?.productWeight.toString() : '',
    width: (route.params?.itemData?.productWidth > 0) ? route.params?.itemData?.productWidth.toString() : '',
  });

  const [fragility, setFragility] = useState((route.params?.itemData?.productFragility) ? route.params?.itemData?.productFragility : false);
  const [stackability, setStackability] = useState((route.params?.itemData?.productStackability) ? route.params?.itemData?.productStackability : false);
  const [ocrTooltipOpen, setOcrTooltipOpen] = useState(false); 
  const [fragileTooltipOpen, setFragileTooltipOpen] = useState(false); 
  const [stackabilityTooltipOpen, setStackabilityTooltipOpen] = useState(false); 

  useEffect(() => {
    if (route.params?.data) {
      console.log(route.params.data);
    }
  }, [route.params?.data]);
  
  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputValues((curInputValues) => {
      return {
        ...curInputValues,
        [inputIdentifier]: enteredValue
      };
    });
  }

  function barcodePressHandler() {
    navigation.navigate('Código de barras', { inputValues } );
  }

  function arPressHandler() {
    navigation.navigate('Medición', { inputValues } );
  }

  async function submitHandler() {
    const productData = {
      barcode: inputValues.barcode,
      productName: inputValues.productName,
      height: +inputValues.height,
      length: +inputValues.length,
      weight: +inputValues.weight,
      width: +inputValues.width,
      entryDate: new Date(),
      id: inputValues.barcode
    };
    const id = await storeProduct(productData);
    navigation.navigate('Dimensionamiento de productos')
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Ingrese las dimensiones</Text>
          <View style={styles.ocrComponent}>
            <Icon
              name='ocr'
              type='material-community'
              size={30}
              color='grey'
            />
          </View>
          <Tooltip
            visible={ocrTooltipOpen}
            onOpen={() => {
              setOcrTooltipOpen(true);
            }}
            onClose={() => {
              setOcrTooltipOpen(false);
            }}
            width={300}
            height={130}
            backgroundColor='white'
            overlayColor='#93a2b899'
            popover={<Text>
              Podés usar esta funcionalidad para obtener los datos del producto sacando una foto con la cámara del celular.
              Buscá en la caja del producto los datos de alto, ancho, largo, peso y sacále una foto.
            </Text>}
          >
          <View style={styles.ocrInfoContainer}>
            <Icon
              name='info-with-circle'
              size={20}
              color='grey'
              type='entypo'
            />
          </View>
          </Tooltip>
        </View>
        <View style={styles.halfInputRow}>
          <Input
            label='Código de barras'
            placeholder='Ingrese el código de barras...'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'barcode'),
              value: inputValues['barcode']
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
        <View style={styles.halfInputRow}>
          <Input
            label='Descripción'
            placeholder='Ej.: Heladera Electrolux F7200SUS...'
            style={styles.allInputRow}
            textInputConfig={{
              onChangeText: inputChangedHandler.bind(this, 'productName'),
              value: inputValues['productName']
            }}
          />
        </View>
        <View>

        </View>
        <View style={styles.halfInputRow}>
          <Input
            label='Alto (cm)'
            returnKeyType={ 'done' }
            placeholder='Ej.: 10 cm'
            textInputConfig={{
              keyboardType: 'decimal-pad',
              onChangeText: inputChangedHandler.bind(this, 'height'),
              value: inputValues['height'],
              returnKeyType:'done'
            }}
          />
          <Pressable
            onPress={() => {
              arPressHandler();
            }}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Icon
                name='augmented-reality'
                type='material-community'
                style={styles.arIcon}
                size={30}
                color='grey'
            />
          </Pressable>
          <Input
            label='Ancho (cm)'
            placeholder='Ej.: 20,33 cm'
            textInputConfig={{
              keyboardType: 'decimal-pad',
              onChangeText: inputChangedHandler.bind(this, 'width'),
              value: inputValues['width'],
              returnKeyType:'done'
            }}
          />
          <Pressable
            onPress={() => {
              arPressHandler();
            }}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Icon
                name='augmented-reality'
                type='material-community'
                style={styles.arIcon}
                size={30}
                color='grey'
            />
          </Pressable>
        </View>
        <View style={styles.halfInputRow}>
          <Input
            label='Largo (cm)'
            placeholder='Ej.: 5,3 cm'
            textInputConfig={{
              keyboardType: 'decimal-pad',
              onChangeText: inputChangedHandler.bind(this, 'length'),
              value: inputValues['length'],
              returnKeyType:'done'
            }}
          />
          <Pressable
            onPress={() => {
              arPressHandler();
            }}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Icon
                name='augmented-reality'
                type='material-community'
                style={styles.arIcon}
                size={30}
                color='grey'
            />
          </Pressable>
          <Input
            label='Peso (kg)'
            placeholder='Ej.: 15,51 kg'
            inputContainerStyle={{ rightIconContainerStyle: 'red' }}
            textInputConfig={{
              keyboardType: 'decimal-pad',
              onChangeText: inputChangedHandler.bind(this, 'weight'),
              value: inputValues['weight'],
              returnKeyType:'done'
            }}
          />
          <View style={styles.blankSpace}></View>
        </View>
        <View style={styles.halfInputRow}>
          <View style={styles.checkBoxContainer}>
            <CheckBox
              center
              accessibilityRole='button'
              title="Frágil"
              checked={fragility}
              onPress={() => setFragility(!fragility)}
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
              checked={stackability}
              onPress={() => setStackability(!stackability)}
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
        <Button style={styles.button} onPress={submitHandler}>
          Confirmar
        </Button>
      </View>
    </View>
  );
}

export default SizingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    marginTop: 15
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center'
  },
  sectionTitle: {
    color: 'grey',
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 4
  },
  allInputRow: {
    flex: 1
  },
  halfInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
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
    position: 'absolute',
    bottom: 40,
  },
  barcodeScanIcon: {
    marginTop: 25,
    marginLeft: 10,
  },
  arIcon: {
    marginTop: 25,
    paddingRight: 10
  },
  blankSpace: {
    paddingRight: 40,
  },
  ocrComponent: {
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    backgroundColor: 'white',
    borderRadius: 40,
    width: 40,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center'
  }, 
  titleContainer: {
    flexDirection: 'row'
  },
  ocrInfoContainer: {
    paddingTop: 10,
    marginLeft: 10
  },
  pressed: {
    opacity: 0.75,
    borderRadius: 4,
  },
})