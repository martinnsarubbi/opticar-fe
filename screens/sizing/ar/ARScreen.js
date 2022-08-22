import React, { useState } from 'react';
import { Dimensions, PixelRatio, StyleSheet, View } from 'react-native';

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

const MeasureSceneAR = () => {
  const [initialized, setInitialized] = useState(false)
  const [text, setText] = useState('Initializing AR...')
  const [firstNodePlaced, setFirstNodePlaced] = useState(false)
  const [distance, setDistance] = useState(null)
  this.state = {
    viroAppProps: {screenText: text},
  }

  const arSceneRef = React.useRef(null)
  const nodeRef1 = React.useRef(null)
  const nodeRef2 = React.useRef(null)

  const _onTrackingUpdated = (state, reason) => {
    // if the state changes to "TRACKING_NORMAL" for the first time, then
    // that means the AR session has initialized!
    if (!initialized && state == ViroTrackingStateConstants.TRACKING_NORMAL) {
      setInitialized(true);
      setText('Ahora puede usar la cámara!');
    }
  }

  const handleSceneClick = source => {
    arSceneRef.current.performARHitTestWithPoint((Dimensions.get('window').width * PixelRatio.get())/2, (Dimensions.get('window').height * PixelRatio.get())/2)
      .then((results) => { 
        for (var i = 0; i < results.length; i++) {
          let result = results[i];
          if (result.type == "ExistingPlaneUsingExtent") {
            // We hit a plane, do something!
            if(firstNodePlaced) {
              console.log('move two')

              nodeRef2.current.setNativeProps({
                position: result.transform.position,
                visible: true,
              })

              nodeRef1.current.getTransformAsync().then(transform => {
                console.log(transform.position);

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
  }

  const handleDrag = (dragToPos, source) => {
    nodeRef1.current.getTransformAsync().then(transform => {
      console.log(transform.position);

      getDistance(transform.position, dragToPos)
    })
  }

  const handleDrag2 = (dragToPos, source) => {
    nodeRef2.current.getTransformAsync().then(transform => {
      console.log(transform.position);

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
          source={require('../../../res/sphere/sphere.obj')}
          position={[0, 0, 0]}
          scale={[.00025, .00025, .00025]}
          type="OBJ"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={['billboardY']}
          resources={[require('./res/sphere/sphere.mtl')]}
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
          //source={require('../../../res/sphere/sphere.obj')}
          position={[0, 0, 0]}
          scale={[.00025, .00025, .00025]}
          type="OBJ"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={['billboardY']}
          //resources={[require('../../../res/sphere/sphere.mtl')]}
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

function ARScreen() {

  return (
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: MeasureSceneAR,
        }}
        style={{flex: 1}}
      />
  )
}

export default ARScreen;