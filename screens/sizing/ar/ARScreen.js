import React, { useState, useEffect } from 'react';
import { Dimensions, PixelRatio, StyleSheet, View, ActivityIndicator, Text, Alert } from 'react-native';
import { Icon } from '@rneui/themed';

import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroMaterials,
  Viro3DObject,
  ViroSpotLight,
  ViroNode,
  ViroAnimations,
  ViroTrackingStateConstants
} from '@viro-community/react-viro';

var styles = StyleSheet.create({
  header: {
    paddingTop: 3,
    paddingBottom: 5 - 1,
    paddingHorizontal: 4
  },
  bold: {
    fontWeight: "bold" 
  },
  headerTitle: {
    fontWeight: "bold",
    color: 'black',
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    letterSpacing: 1.5,
  },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  root: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    flex: 1,
  }
});

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require('../../../res/grid_bg.jpg'),
  },
});

ViroAnimations.registerAnimations({
  rotate: {
    properties: {
      rotateY: "+=90"
    },
    duration: 250, //.25 seconds
  },
});


const MeasureSceneAR = ({ arSceneNavigator }) => {
  const [firstNodePlaced, setFirstNodePlaced] = useState(false)
  const [distance, setDistance] = useState(null)
  const [initialized, setInitialized] = useState(false)
  const {
    initializeARText,
    initializedAR,
    focusOnPlane,
    setBoxHeight,
    setBoxWidth,
    setBoxLength
  } = arSceneNavigator.viroAppProps

  let arSceneRef = React.useRef(null)
  let nodeRef1 = React.useRef(null)
  let nodeRef2 = React.useRef(null)

  const _onTrackingUpdated = (state, reason) => {
    // if the state changes to "TRACKING_NORMAL" for the first time, then
    // that means the AR session has initialized!
    if (!initialized && state == ViroTrackingStateConstants.TRACKING_NORMAL) {
      initializedAR();
      setInitialized(true)
    }
  }

  function reset() {
    setFirstNodePlaced(false);
    setDistance(null)
    nodeRef1.current.setNativeProps({
      position: [0, 0, 0],
      visible: false,
    })
    nodeRef2.current.setNativeProps({
      position: [0, 0, 0],
      visible: false,
    })
  }

  const handleSceneClick = source => {
    arSceneRef.current.performARHitTestWithPoint((Dimensions.get('window').width * PixelRatio.get())/2, (Dimensions.get('window').height * PixelRatio.get())/2)
      .then((results) => { 
        for (var i = 0; i < results.length; i++) {
          let result = results[i];
          if (result.type == "EstimatedHorizontalPlane") {
            focusOnPlane();
          }
          if (result.type == "ExistingPlaneUsingExtent") {
            initializeARText();
            // We hit a plane, do something!
            if(firstNodePlaced) {
              console.log('move two')

              nodeRef2.current.setNativeProps({
                position: result.transform.position,
                visible: true,
              })

              nodeRef1.current.getTransformAsync().then(transform => {
                getDistance(transform.position, result.transform.position)
              })
            
            } else {
              console.log('move one')
              
              nodeRef2.current.setNativeProps({visible: false});

              nodeRef1.current.setNativeProps({
                position: result.transform.position,
                visible: true
              })
              setFirstNodePlaced(true)
            }
          }
        }
      });
  }

  const getDistance = (positionOne, positionTwo) => {
    // Compute the difference vector between the two hit locations.
    const dx = positionOne[0] - positionTwo[0];
    const dy = positionOne[1] - positionTwo[1];
    const dz = positionOne[2] - positionTwo[2];

    // // Compute the straight-line distance.
    const distanceMeters = Math.sqrt(dx*dx + dy*dy + dz*dz);

    console.log("Distance: " + distanceMeters*100)

    setDistance(distanceMeters*100)

    let dimension = (Math.round(distanceMeters*10000)/100)
    console.log("alert present:" + this.alertPresent)
    if (!this.alertPresent) {
      Alert.alert(
        "Medición realizada",
        "Se ha realizado una medición por " + dimension + "cm. Desea confirmarla como alguna de estas medidas?",
        [
          {
            text: "Alto",
            onPress: () => {
              setBoxHeight(dimension);
              reset();
            }
          },
          {
            text: "Ancho",
            onPress: () => {
              setBoxWidth(dimension);
              reset();
            }
          },
          {
            text: "Largo",
            onPress: () => {
              setBoxLength(dimension);
              reset();
            }
          },
          {
            text: "Realizar nueva medición",
            style: "cancel",
            onPress: () => reset()
          },
        ]
      );
    }
  }

  const handleDrag = (dragToPos, source) => {
    nodeRef1.current.getTransformAsync().then(transform => {
      getDistance(transform.position, dragToPos)
    })
  }

  const handleDrag2 = (dragToPos, source) => {
    nodeRef2.current.getTransformAsync().then(transform => {
      getDistance(transform.position, dragToPos)
    })
  }
  
  return (
    <ViroARScene ref={arSceneRef} onTrackingUpdated={_onTrackingUpdated} onClick={handleSceneClick}>
  
      <ViroNode ref={nodeRef1} position={[0, 0, 0]} visible={false} onClick={() => {}}
        scale={[2.0, 2.0, 2.0]}
        onDrag={handleDrag2}
        dragType="FixedToWorld" 
      >
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0,-1,-.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={2}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={5}
          shadowOpacity={.7} />

        <Viro3DObject
          source={require("../../../res/sphere/sphere.obj")}
          position={[0, 0, 0]}
          scale={[.00025, .00025, .00025]}
          type="OBJ"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={['billboardY']}
          resources={[require("../../../res/sphere/sphere.mtl")]}
        />
      </ViroNode>

      <ViroNode ref={nodeRef2} position={[0, 0, 0]} visible={false} onClick={() => {}}
        scale={[2.0, 2.0, 2.0]}
        onDrag={handleDrag}
        dragType="FixedToWorld" 
      >
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0,-1,-.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={2}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={5}
          shadowOpacity={.7} />

        <Viro3DObject
          source={require("../../../res/sphere/sphere.obj")}
          position={[0, 0, 0]}
          scale={[.00025, .00025, .00025]}
          type="OBJ"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={['billboardY']}
          resources={[require("../../../res/sphere/sphere.mtl")]}
        />

          <ViroText 
            text={distance ? distance.toFixed(2) + 'cm' : ''}
            extrusionDepth={1}
            scale={[.1, .1, .1]}
            position={[0, 0, -0.05]}
            style={styles.helloWorldTextStyle}
          />
      </ViroNode>

    </ViroARScene>
  )
}

function ARScreen({ navigation, route }) {

  const [screenText, setText] = useState('Inicializando AR. Mire a su alrededor con la cámara lentamente para tener una buena medición.')
  const [height, setHeight] = useState('')
  const [width, setWidth] = useState('')
  const [length, setLength] = useState('')
  
  const [initialized, setInitialized] = useState(false)

  const viroAppProps = {
    initializeARText: () => setText('AR. Inicializado'),
    focusOnPlane: () => setText('Mire a su alrededor lentamente para tener una buena medición.'),
    initializedAR: () => setInitialized(true),
    setBoxHeight: (height) => setHeight(height),
    setBoxWidth: (width) => setWidth(width),
    setBoxLength: (length) => setLength(length),
  };

  useEffect(() => {
    async function arComplete() {
      console.log("Llegue");
      console.log("height:" + height.toString());
      route.params.inputValues.height = height.toString();
      route.params.inputValues.length = length.toString();
      route.params.inputValues.width = width.toString();
      const navigationParams = route.params.inputValues;

      if (height > 0 && width > 0 && length > 0) {
        Alert.alert(
          "Ha realizado todas las mediciones! ",
          "Volver a la pantalla anterior?",
          [
            {
              text: "Si",
              onPress: () => {
                navigation.navigate('Dimensionamiento de nuevo producto', { navigationParams })
              }
            },
            {
              text: "Realizar nueva medición",
              style: "cancel",
              onPress: () => {}
            }
          ]
          
        );
      }
    }
    arComplete();
  }, [height, width, length]);

  return (
    <View style={{flex: 1}}>
      <ViroARSceneNavigator
        autofocus={true}
        viroAppProps={viroAppProps}
        initialScene={{
          scene: MeasureSceneAR,
        }}
        style={{flex: 1, backgroundColor: 'red'}}
      />
      <View style={{position:'absolute', left:0, right:0, top:0, bottom:0, alignItems: 'center', justifyContent:'center', backgroundColor: 'white', height: 40}}>
        <Text>{screenText}</Text>
      </View>
      <View style={{position:'absolute', left:0, right:0, top:40, bottom:0, alignItems: 'center', justifyContent:'center', backgroundColor: 'white', height: 50, flexDirection: 'row'}}>
        <Text style={{paddingRight: 20}}>Alto: {height}</Text>
        <Text style={{paddingRight: 20}}>Ancho: {width}</Text>
        <Text>Largo: {length}</Text>
      </View>
      <View style={{position:'absolute', bottom: '44.5%', left: '47%', alignItems: 'center', justifyContent:'center', height: 20, width: 20}}>
        <Icon name='plus' color='white' type='entypo' />
      </View>
    </View>
  )
}

export default ARScreen;