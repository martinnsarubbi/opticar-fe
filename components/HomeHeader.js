import * as React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Icon } from '@rneui/base';

function HomeHeader() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.textStyle}>Menu</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginRight: 30,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize:20
  }
});

export default HomeHeader;
