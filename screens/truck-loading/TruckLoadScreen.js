import React from 'react';
import { View, Text } from 'react-native';
import { Scene, Mesh, MeshStandardMaterial, PerspectiveCamera , BoxGeometry, PointLight, PointLightHelper } from 'three';
import { Renderer } from 'expo-three';
import { GLView } from 'expo-gl';


function TruckLoadScreen() {

  const onContextCreate = async (gl) => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      gl.drawingBufferWidth/gl.drawingBufferHeight,
      0.6,
      1200
    );
    gl.canvas = { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight}
    camera.position.z = 20;
    camera.position.y = 2;
    camera.position.x = 2;

    const renderer = new Renderer({gl});
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    var distance = 0;

    const geometry = new BoxGeometry(20,10,15)
    const material = new MeshStandardMaterial({color: 'black', transparent: true, opacity: 0.1, roughness: 1, wireframe: true})
    const cube = new Mesh(geometry,material)
    cube.position.z = distance
    scene.add(cube)
    distance +=2

    for(var i = 0; i< 4; i++) {
      const geometry = new BoxGeometry(1,1,1)
      const material = new MeshStandardMaterial({color: 'white', metalness: 1, roughness: 1})
      material.visible = true;
      const cube = new Mesh(geometry,material)
      cube.position.z = distance
      scene.add(cube)
      distance +=2
    }

    const lights = []; // Storage for lights
    const lightHelpers = []; // Storage for light helpers

    const lightValues = [
      {colour: 0x38E000, intensity: 8, dist: 12, x: 1, y: 0, z: 8},
      {colour: 0xC56CEF, intensity: 6, dist: 12, x: -2, y: 1, z: -10},
      {colour: 0x000078, intensity: 3, dist: 10, x: 0, y: 10, z: 1},
      {colour: 0x00ffdd, intensity: 6, dist: 12, x: 0, y: -10, z: -1},
      {colour: 0x16A7F5, intensity: 6, dist: 12, x: 10, y: 3, z: 0},
      {colour: 0x000078, intensity: 6, dist: 12, x: -10, y: -1, z: 0}
    ];

    for (let i=0; i<6; i++) {
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

    
    const render = ()=> {
      requestAnimationFrame(render);
      scene.rotation.z -= 0.005;
      scene.rotation.x -= 0.01;
      renderer.render(scene, camera)
      gl.endFrameEXP()
    }

    render()

  }
  
  return (
    <View>
      <GLView 
        onContextCreate = {onContextCreate}
        style={{width: 400, height: 400, backgroundColor: 'yellow', borderRadius: 80}}
      />
    </View>
  );
}

export default TruckLoadScreen;