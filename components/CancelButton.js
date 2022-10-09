import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function CancelButton({ children, onPress, style }) {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <LinearGradient
          // Background Linear Gradient
          colors={['#DC1C13', '#D07470']}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {children}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

export default CancelButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    padding: 8,
    paddingHorizontal: 86,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold'
  },
  pressed: {
    opacity: 0.75,
    borderRadius: 4,
  },
});