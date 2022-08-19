import * as React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Icon } from '@rneui/base';

function HomeHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          style={styles.imageStyle}
          source={require('../assets/location.png')}
        />
      </View>
      <View style={styles.addessContainer}>
        <Text style={styles.textStyle}>Los Andes 442, Esteban Echeverría, Buenos Aires, Argentina</Text>
      </View>
      <View style={styles.gearContainer}>
        <Icon
          name='gear'
          type='octicon'
          color='#517fa4'
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageStyle: {
    height: 40,
    width: 40
  },
  imageContainer: {
    flexDirection: 'row',
    height: 40,
    width: 50,
  },
  addessContainer: {
    width: 280,
    height: 40,
  },
  textStyle: {
    fontWeight: 'bold',
    paddingLeft: 10
  },
  gearContainer: {
    flexDirection: 'row',
    height: 40,
    width: 40,
  }
});

export default HomeHeader;
