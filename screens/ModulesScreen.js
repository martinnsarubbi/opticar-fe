import { ScrollView, View, StyleSheet, Text, Pressable } from 'react-native';
import ModuleGridTitle from '../components/ModuleGridTitle';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { fetchDeliveries } from '../util/http';

function ModulesScreen({ navigation }) {

  return (
    <ScrollView>
      <View style={styles.container}>
        <LinearGradient
          // Background Linear Gradient
          colors={['#8155BA', '#BEAFC2']}
          style={styles.moduleContainer}
        >
          <Pressable onPress={() => navigation.navigate('Entregas')}>
            <Text style={styles.moduleTitle}>Gestionar entregas</Text>
          </Pressable>
        </LinearGradient>
        <LinearGradient
          // Background Linear Gradient
          colors={['#BB8023', '#FFFB64']}
          style={styles.moduleContainer}
        >
          <Pressable onPress={() => navigation.navigate('Dimensionamiento de productos')}>
            <Text style={styles.moduleTitle}>Dimensionar Pedidos</Text>
          </Pressable>
        </LinearGradient>
        <LinearGradient
          // Background Linear Gradient
          colors={['#eb3349', '#f5715b']}
          style={styles.moduleContainer}
        >
          <Pressable onPress={() => navigation.navigate('Planificación')}>
            <Text style={styles.moduleTitle}>Planificar Viajes</Text>
          </Pressable>
        </LinearGradient>
        <LinearGradient
          // Background Linear Gradient
          colors={['#00254d', '#0055b3']}
          style={styles.moduleContainer}
        >
          <Text style={styles.moduleTitle}>Carga al camión</Text>
        </LinearGradient>
        <LinearGradient
          // Background Linear Gradient
          colors={['#2EB62C', '#ABE098']}
          style={styles.moduleContainer}
        >
          <Text style={styles.moduleTitle}>Seguimiento</Text>
        </LinearGradient>
      </View>
    </ScrollView>
 )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  moduleTitle: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  moduleContainer: {
    height: 70,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15
  },
  pressed: {
    opacity: 0.75,
    borderRadius: 4,
  },
});


export default ModulesScreen;