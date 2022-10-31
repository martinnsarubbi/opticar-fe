import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Image } from 'react-native';
import { Scene, Mesh, MeshStandardMaterial, PerspectiveCamera , BoxGeometry, PointLight, PointLightHelper } from 'three';
import { Renderer } from 'expo-three';
import { GLView } from 'expo-gl';
import Button from '../../components/Button';
import { getPlan, updatePlanStatus  } from '../../util/http';
import { CheckBox } from '@rneui/themed';
import Modal from 'react-native-modal';
import OrbitControlsView from '../../components/orbit-controls/OrbitControlsView';
import DatePicker from 'react-native-date-picker';
import { Icon } from '@rneui/themed';

function TruckLoadScreen() {
  
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [camera, setCamera] = useState(null);
  const [plan, setPlan] = useState();
  const [deliveries, setDeliveries] = useState();
  const [truck, setTruck] = useState();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  async function handleModalConfirm() {
    setIsModalVisible(() => !isModalVisible);
    let response = await updatePlanStatus([date.getFullYear(),  padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join(''), 'Cargado');
  }

  useEffect(() => {
    getPlanData();
  }, []);

  async function getPlanData() {
    try {
      let response = await getPlan([date.getFullYear(),  padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join(''));
      setPlan(response);
    } catch (error) {
      console.log(error)
    }
  }

  function tripPressHandler(trip) {
    setDeliveries(trip.load);
    var arr = []
    arr.push(trip)
    setTruck(arr)
    console.log(arr);
  }

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  uiCheckPressHandler
  function uiCheckPressHandler(item) {
    let newDeliveries = [...deliveries];
    for(const key in deliveries) {
      if(item.keyNumber == newDeliveries[key].keyNumber) {
        newDeliveries[key].uiCheck = !item.uiCheck
      }
    }
    setDeliveries(newDeliveries);
  }

  const renderTrucklItem = ({item}) => (
    <View style={{flex: 1, backgroundColor: 'white', width: 80, height: 100, flexDirection: 'column', alignItems:'center', padding: 10, margin: 10, borderRadius: 10, shadowColor: 'black', shadowOpacity: 1}}>
      <Pressable
        onPress={() => { tripPressHandler(item) }}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={{flex: 1}}>
          <Image 
            style={{height: 40, width: 40}}
            source={require('../../assets/delivery-truck.png')}
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={{flex: 1, fontSize: 17}}>Viaje {item.key}</Text>
        </View>
      </Pressable>
    </View>
  
  )

  const renderDeliveryItem = ({item}) => (
    <Pressable
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
          checked={item.uiCheck}
          onPress={() => uiCheckPressHandler(item)}
        />
      </View>
      <View style={styles.rowMiddle}>
        <Text style={styles.productText}>{item.orderedDelivery.delivery.product.productName}</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.volumeText}>{(item.height * item.width * item.length / 1000000).toFixed(2)} m3</Text>
      </View>
    </Pressable>
  )

  const renderView = ({item}) => (
    <OrbitControlsView style={{width: 290, height: 290}} camera={camera}>
      <GLView 
        onContextCreate={gl => {
          onContextCreate(gl, {item}, item.keyNumber-1);
        }}
        style={{width: 290, height: 290, borderRadius: 80}}
      />
    </OrbitControlsView>

  )
  
  function onContextCreate(gl, plan, tripNumber) {
    var x = plan.item
    console.log("tripNumber: " + tripNumber)
    console.log("x:" + x)
    console.log(x);
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      gl.drawingBufferWidth/gl.drawingBufferHeight,
      0.6,
      1200
    );
    gl.canvas = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight}
    camera.position.z = 30;
    camera.position.y = 30;
    camera.position.x = 30;

    const renderer = new Renderer({gl});
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    console.log("Llegue3")

    console.log("Llegue4")

    const divisor = 10;
    const geometry = new BoxGeometry(x.truck.width/divisor, x.truck.height/divisor,x.truck.length/divisor)
    const material = new MeshStandardMaterial({color: 'red', transparent: true, opacity: 0.2})
    const cube = new Mesh(geometry,material)
    cube.position.x = 0
    cube.position.y = 0
    cube.position.z = 0
    scene.add(cube);

    const edges = new THREE.EdgesGeometry( geometry );
    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 'black' } ) );
    scene.add( line );

    camera.lookAt(-1,-1,-1)

    for(var i = 0; i < x.load.length; i++) {
      const geometry = new BoxGeometry(x.load[i].width/divisor,x.load[i].height/divisor,x.load[i].length/divisor)
      const material = new MeshStandardMaterial({color: 'white', metalness: 1, roughness: 1})
      material.visible = true;
      const cube = new Mesh(geometry,material)
      cube.position.x = - x.truck.width/divisor / 2 + x.load[i].position.c1.axisX/divisor + x.load[i].width/divisor / 2
      cube.position.y = - x.truck.height/divisor / 2 + x.load[i].position.c1.axisZ/divisor + x.load[i].height/divisor / 2
      cube.position.z = - x.truck.length/divisor / 2 + x.load[i].position.c1.axisY/divisor + x.load[i].length/divisor / 2
      scene.add(cube)
      const edges = new THREE.EdgesGeometry( geometry );
      const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 'black' } ) );
      line.position.x = - x.truck.width/divisor / 2 + x.load[i].position.c1.axisX/divisor + x.load[i].width/divisor / 2
      line.position.y = - x.truck.height/divisor / 2 + x.load[i].position.c1.axisZ/divisor + x.load[i].height/divisor / 2
      line.position.z = - x.truck.length/divisor / 2 + x.load[i].position.c1.axisY/divisor + x.load[i].length/divisor / 2
      scene.add( line );
    }

    const lights = []; // Storage for lights
    const lightHelpers = []; // Storage for light helpers

    const lightValues = [
      {colour: 0x38E000, intensity: 8, dist: 500, x: 100, y: 100, z: 100},
      {colour: 0x38E000, intensity: 8, dist: 500, x: -100, y: -100, z: -100},
    ];

    for (let i=0; i<2; i++) {
      // Loop 6 times to add each light to lights array
      // using the lightValues array to input properties
      lights[i] = new PointLight(
        lightValues[i]['colour'], 
        lightValues[i]['intensity'], 
        lightValues[i]['dist']
      );
    
      lights[i].position.set(
        lightValues[i]['x'], 
        lightValues[i]['y'], 
        lightValues[i]['z']
      );
    
      scene.add(lights[i]);

      // Add light helpers for each light
      lightHelpers[i] = new PointLightHelper(lights[i]);
      scene.add(lightHelpers[i]);
    };

    setCamera(camera);
    
    var id;
    const render = ()=> {
      id = requestAnimationFrame(render);
      //scene.rotation.z -= 0.005;
      //scene.rotation.x -= 0.01;
      renderer.render(scene, camera)
      gl.endFrameEXP()
    }

    render()

  }
  
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          Fecha de envío: {[padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear(),].join('/')}
        </Text>
        <Icon
          name='calendar'
          type='material-community'
          style={styles.dateIcon}
          size={30}
          color='grey'
          onPress={() => setOpenDatePicker(true)}
        />
        <DatePicker
          modal
          open={openDatePicker}
          mode="date"
          date={date}
          onConfirm={(date) => {
            setOpenDatePicker(false)
            setDate(date)
            getPlanData()
          }}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
        />
      </View>
      <View style={{flex: 0.7}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View>
            <FlatList
              data={truck}
              renderItem={renderView}
              scrollEnabled={false}
              extraData={truck}
              keyExtractor={item => item.key}
              style={{flex: 1, marginBottom: 20, backgroundColor: 'white', width: '100%'}}
            />
          </View>
          <View>
            <FlatList
              data={plan}
              renderItem={renderTrucklItem}
              extraData={plan}
              keyExtractor={item => item.key}
              style={{flex: 1, height: 300, width: 100}}
            />
          </View>
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'column', height: 300}}>
        <FlatList
          data={deliveries}
          renderItem={renderDeliveryItem}
          extraData={deliveries}
          keyExtractor={item => item.key}
          style={{flex: 1, marginBottom: 20, backgroundColor: 'white'}}
        />
        
        <Button style={{height: 100}} title="Hide modal" onPress={handleModalConfirm}>
          Confirmar
        </Button>
        <Modal isVisible={isModalVisible}>
          <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center', marginTop: 200, marginBottom: 450, borderRadius: 20, paddingTop: 40, paddingHorizontal: 20 }}>
            <Text style={{fontSize: 15}}>Se han cargado todos los productos al transporte. Por favor, precinte el camión.</Text>
            <Button title="Hide modal" onPress={handleModal} style={{marginTop: 10}}>
              OK
            </Button>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
    borderRadius: 4,
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1
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
  productText: {
    fontWeight: 'bold'
  },
  volumeText: {
    textAlign: 'right',
  },
  dateIcon: {
    marginLeft: 10,
  },
  dateText: {
    fontSize: 17,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    marginBottom: 15,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
})

export default TruckLoadScreen;