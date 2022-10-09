import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Scene, Mesh, MeshStandardMaterial, PerspectiveCamera , BoxGeometry, PointLight, PointLightHelper } from 'three';
import { Renderer } from 'expo-three';
import { GLView } from 'expo-gl';
import { CURRENT_HOST } from '../../environment';
import axios from 'axios';
import Button from '../../components/Button';

const planningData = {
  "originLatitude": -34.66733,
  "originLongitude": -58.4397737,
  "originDescription": "Centro de Ditribución X S.A.",
  "deliveriesInfo":[
     {
        "key":"0",
        "deliveryid":1000000,
        "status":"Pendiente de planificar",
        "customerName":"Martin",
        "customerSurname":"Sarubbi",
        "customerAddress":"Serrano 557",
        "customerDni":"33944674",
        "customerTelephone":"2719414137",
        "customerLongitude":-58.4491481,
        "customerLatitude":-34.5977777,
        "customerDistrict":"Villa Crespo",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Aire Acondicionado Split Candy CY3400FC - 3000F",
        "productCategory":"Heladera",
        "productId":"160841",
        "productWeight":130,
        "productWidth":91.2,
        "productHeight":179,
        "productLength":73.8,
        "productStackability":false,
        "productFragility":false,
        "searchField":"Aire Acondicionado Split Candy CY3400FC - 3000F,160841,Villa Crespo,Ciudad de Buenos Aires",
        "checkedForPlanning":true,
        "initialLatitude": -34.5977777,
        "initialLongitude": -58.4491481
     },
     {
        "key":"1",
        "deliveryid":1000001,
        "status":"Pendiente de planificar",
        "customerName":"Juan",
        "customerSurname":"Rodriguez",
        "customerAddress":"Medina 631",
        "customerDni":"34304059",
        "customerTelephone":"3435620199",
        "customerLongitude":-58.4847839,
        "customerLatitude":-34.6427886,
        "customerDistrict":"Parque Avellaneda",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Freezer Gafa Eternity L290 AB 285Lt",
        "productCategory":"Heladera",
        "productId":"161088",
        "productWeight":47,
        "productWidth":61.4,
        "productHeight":142.7,
        "productLength":62.1,
        "productStackability":true,
        "productFragility":false,
        "searchField":"Freezer Gafa Eternity L290 AB 285Lt,161088,Parque Avellaneda,Ciudad de Buenos Aires",
        "checkedForPlanning":true
     },
     {
        "key":"2",
        "deliveryid":1000002,
        "status":"Pendiente de planificar",
        "customerName":"Joaquín",
        "customerSurname":"Perez",
        "customerAddress":"Nogoyá 3132",
        "customerDni":"27045921",
        "customerTelephone":"5408152148",
        "customerLongitude":-58.4927018,
        "customerLatitude":-34.6039772,
        "customerDistrict":"Villa del Parque",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Smart TV 4K UHD Samsung 65\" UN65AU7000",
        "productCategory":"TV",
        "productId":"502158",
        "productWeight":20.9,
        "productWidth":144.9,
        "productHeight":9.6,
        "productLength":28.2,
        "productStackability":false,
        "productFragility":false,
        "searchField":"Smart TV 4K UHD Samsung 65\" UN65AU7000,502158,Villa del Parque,Ciudad de Buenos Aires",
        "checkedForPlanning":true
     },
     {
        "key":"3",
        "deliveryid":1000005,
        "status":"Pendiente de planificar",
        "customerName":"Pablo",
        "customerSurname":"Gonzalez",
        "customerAddress":"Sta. Magdalena 377",
        "customerDni":"15673490",
        "customerTelephone":"7387098113",
        "customerLongitude":-58.3834447,
        "customerLatitude":-34.6471401,
        "customerDistrict":"Barracas",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Panel De Tv 128 Tabaco",
        "productCategory":"Mueble",
        "productId":"1490453",
        "productWeight":39,
        "productWidth":138,
        "productHeight":12,
        "productLength":47,
        "productStackability":true,
        "productFragility":false,
        "searchField":"Panel De Tv 128 Tabaco,1490453,Barracas,Ciudad de Buenos Aires",
        "checkedForPlanning":true
     },
     {
        "key":"4",
        "deliveryid":1000006,
        "status":"Pendiente de planificar",
        "customerName":"Martin",
        "customerSurname":"Sarubbi",
        "customerAddress":"Serrano 557",
        "customerDni":"33944674",
        "customerTelephone":"2719414137",
        "customerLongitude":-58.4491481,
        "customerLatitude":-34.5977777,
        "customerDistrict":"Villa Crespo",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Aire Acondicionado Split Candy CY3400FC - 3000F",
        "productCategory":"Heladera",
        "productId":"160841",
        "productWeight":130,
        "productWidth":91.2,
        "productHeight":179,
        "productLength":73.8,
        "productStackability":false,
        "productFragility":false,
        "searchField":"Aire Acondicionado Split Candy CY3400FC - 3000F,160841,Villa Crespo,Ciudad de Buenos Aires",
        "checkedForPlanning":true
     },
     {
        "key":"5",
        "deliveryid":1000036,
        "status":"Pendiente de planificar",
        "customerName":"Olivia",
        "customerSurname":"Candia",
        "customerAddress":"Sta. Catalina 1522",
        "customerDni":"23000232",
        "customerTelephone":"4820493276",
        "customerLongitude":-58.4228897,
        "customerLatitude":-34.6543561,
        "customerDistrict":"Nueva Pompeya",
        "customerProvince":"Ciudad de Buenos Aires",
        "productName":"Tostadora Eléctrica Atma To8020i 700w 7 Niveles Full",
        "productCategory":null,
        "productId":"94TO8020I",
        "productWeight":"",
        "productWidth":18.01,
        "productHeight":16.03,
        "productLength":39.37,
        "productStackability":false,
        "productFragility":false,
        "searchField":"Tostadora Eléctrica Atma To8020i 700w 7 Niveles Full,94TO8020I,Nueva Pompeya,Ciudad de Buenos Aires",
        "checkedForPlanning":true
     },
     {
      "key":"6",
      "deliveryid":1000037,
      "status":"Pendiente de planificar",
      "customerName":"Olivia",
      "customerSurname":"Candia",
      "customerAddress":"Sta. Catalina 1522",
      "customerDni":"23000232",
      "customerTelephone":"4820493276",
      "customerLongitude":-58.4228897,
      "customerLatitude":-34.6543561,
      "customerDistrict":"Nueva Pompeya",
      "customerProvince":"Ciudad de Buenos Aires",
      "productName":"Tostadora Eléctrica Atma To8020i 700w 7 Niveles Full",
      "productCategory":null,
      "productId":"94TO8020I",
      "productWeight":"",
      "productWidth":18.01,
      "productHeight":16.03,
      "productLength":39.37,
      "productStackability":false,
      "productFragility":false,
      "searchField":"Tostadora Eléctrica Atma To8020i 700w 7 Niveles Full,94TO8020I,Nueva Pompeya,Ciudad de Buenos Aires",
      "checkedForPlanning":true
   },
   {
    "key":"7",
    "deliveryid":1000052,
    "status":"Pendiente de planificar",
    "customerName":"Joaquín",
    "customerSurname":"Perez",
    "customerAddress":"Nogoyá 3132",
    "customerDni":"27045921",
    "customerTelephone":"5408152148",
    "customerLongitude":-58.4927018,
    "customerLatitude":-34.6039772,
    "customerDistrict":"Villa del Parque",
    "customerProvince":"Ciudad de Buenos Aires",
    "productName":"Smart TV 4K UHD Samsung 65\" UN65AU7000",
    "productCategory":"TV",
    "productId":"502158",
    "productWeight":20.9,
    "productWidth":144.9,
    "productHeight":9.6,
    "productLength":28.2,
    "productStackability":false,
    "productFragility":false,
    "searchField":"Smart TV 4K UHD Samsung 65\" UN65AU7000,502158,Villa del Parque,Ciudad de Buenos Aires",
    "checkedForPlanning":true
  },
  {
    "key":"8",
    "deliveryid":1000052,
    "status":"Pendiente de planificar",
    "customerName":"Joaquín",
    "customerSurname":"Perez",
    "customerAddress":"Nogoyá 3132",
    "customerDni":"27045921",
    "customerTelephone":"5408152148",
    "customerLongitude":-58.4927018,
    "customerLatitude":-34.6039772,
    "customerDistrict":"Villa del Parque",
    "customerProvince":"Ciudad de Buenos Aires",
    "productName":"Smart TV 4K UHD Samsung 65\" UN65AU7000",
    "productCategory":"TV",
    "productId":"502158",
    "productWeight":20.9,
    "productWidth":144.9,
    "productHeight":9.6,
    "productLength":28.2,
    "productStackability":false,
    "productFragility":false,
    "searchField":"Smart TV 4K UHD Samsung 65\" UN65AU7000,502158,Villa del Parque,Ciudad de Buenos Aires",
    "checkedForPlanning":true
  }
  ],
  "trucksInfo":[
     {
        "key":"0",
        "licensePlate":"AB123CD",
        "truckDescription":"CAMIONAZO FDA$@",
        "width":280,
        "length":500,
        "height":240,
        "maximumWeightCapacity":3000,
        "searchField":"undefined,AB123CD",
        "checkedForPlanning":true
     },
     {
        "key":"1",
        "licensePlate":"AS432FS",
        "truckDescription":"CAMIONAZO FDA$@",
        "width":270,
        "length":480,
        "height":250,
        "maximumWeightCapacity":2800,
        "searchField":"undefined,AS432FS",
        "checkedForPlanning":false
     }
  ]
}

function TruckLoadScreen() {
  
  const [camera, setCamera] = useState(null);
  const [plan, setPlan] = useState();
  
  async function startPlanning() {
    try {
      const planningData = {
        deliveriesInfo: deliveries,
        trucksInfo: trucks,
        originLatitude: inputValues.latitude,
        originLongitude: inputValues.longitude,
        originDescription: inputValues.address
      }
      let response = await planningAlgorithm(planningData);
      setPlan(response);
      console.log(plan)
    } catch (error) {
      console.log(error)
    }
  }

  const renderTrucklItem = ({item}) => (
    <View style={{flex: 1, backgroundColor: 'red', width: 100, height: 100, flexDirection: 'column', alignItems:'center', padding: 10, margin: 10, borderRadius: 10, shadowColor: 'black', shadowOpacity: 1}}>
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
      <View style={styles.rowMiddle}>
        <Text style={styles.productText}>{item.orderedDelivery.delivery.product.productName}</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.volumeText}>{(item.height * item.width * item.length / 1000000).toFixed(2)} m3</Text>
      </View>
    </Pressable>
  )


  const onContextCreate = async (gl) => {
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

    let response = await axios.post(CURRENT_HOST + '/api/planning', planningData);
    const divisor = 10;

    const geometry = new BoxGeometry(response.data[0].truck.width/divisor, response.data[0].truck.height/divisor,response.data[0].truck.length/divisor)
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

    

    for(var i = 0; i < response.data[0].load.length; i++) {
      const geometry = new BoxGeometry(response.data[0].load[i].width/divisor,response.data[0].load[i].height/divisor,response.data[0].load[i].length/divisor)
      const material = new MeshStandardMaterial({color: 'white', metalness: 1, roughness: 1})
      material.visible = true;
      const cube = new Mesh(geometry,material)
      cube.position.x = - response.data[0].truck.width/divisor / 2 + response.data[0].load[i].position.c1.axisX/divisor + response.data[0].load[i].width/divisor / 2
      cube.position.y = - response.data[0].truck.height/divisor / 2 + response.data[0].load[i].position.c1.axisZ/divisor + response.data[0].load[i].height/divisor / 2
      cube.position.z = - response.data[0].truck.length/divisor / 2 + response.data[0].load[i].position.c1.axisY/divisor + response.data[0].load[i].length/divisor / 2
      scene.add(cube)
      const edges = new THREE.EdgesGeometry( geometry );
      const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 'black' } ) );
      line.position.x = - response.data[0].truck.width/divisor / 2 + response.data[0].load[i].position.c1.axisX/divisor + response.data[0].load[i].width/divisor / 2
      line.position.y = - response.data[0].truck.height/divisor / 2 + response.data[0].load[i].position.c1.axisZ/divisor + response.data[0].load[i].height/divisor / 2
      line.position.z = - response.data[0].truck.length/divisor / 2 + response.data[0].load[i].position.c1.axisY/divisor + response.data[0].load[i].length/divisor / 2
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
    
    const render = ()=> {
      requestAnimationFrame(render);
      //scene.rotation.z -= 0.005;
      //scene.rotation.x -= 0.01;
      renderer.render(scene, camera)
      gl.endFrameEXP()
    }

    render()

  }
  
  return (
    <View style={{flex: 1, alignContent: 'center', flexDirection: 'column'}}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <GLView 
          onContextCreate = {onContextCreate}
          style={{width: 300, height: 300, backgroundColor: 'red', borderRadius: 80, alignContent: 'center'}}
        />
        <FlatList
          data={plan}
          renderItem={renderTrucklItem}
          extraData={plan}
          keyExtractor={item => item.key}
          style={{flex: 1, height: 300,  backgroundColor: 'blue'}}
        />
      </View>
      <View style={{flex: 1, flexDirection: 'column'}}>
        <FlatList
          data={plan}
          renderItem={renderDeliveryItem}
          extraData={plan}
          keyExtractor={item => item.orderedDelivery.delivery.deliveryNumber}
          style={{flex: 1, height: 100, marginBottom: 20, backgroundColor: 'green'}}
        />
        <Button>
          Confirmar
        </Button>
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
})

export default TruckLoadScreen;