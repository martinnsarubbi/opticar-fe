import { Pressable, View, Text, StyleSheet, Platform, Image } from 'react-native';

function ModuleGridTitle({title, color, onPress, indicator, unidad}) {
  return (
    <View style={styles.gridItem}>
      <Pressable
        android_ripple={{color:'#ccc'}}
        style={({ pressed }) => 
          [styles.button,
          pressed ? styles.buttonPressed : null]}
          onPress={onPress}
      >
        <View style={[styles.innerContainer, {backgroundColor: color}]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.indicatorStyle}>{indicator}</Text>
          <Text style={styles.title}>{unidad}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 8,
    height: 120,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  indicatorStyle: {
    fontWeight: 'bold',
    fontSize: 40,
    marginBottom: 5,
    color: 'white',
    textAlign: 'center'
  },
  innerContainer: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
    textAlign: 'center'
  }
});

export default ModuleGridTitle;