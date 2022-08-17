import { View, StyleSheet, Pressable } from "react-native";
import { Icon } from "@rneui/themed";

function AddButton({ navigationScreen, navigation }) {

  function onPressed() {
    navigation.navigate(navigationScreen);
  }

  return(
    <View style={styles.circleContainer}>
      <Pressable onPress={() => { onPressed() }}
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? '#e2e2e2'
            : 'white',
          opacity: pressed
            ? 0.75 : 1
        },
        styles.addOuterCircle
      ]}
      >
        <View style={styles.addInnerCircle}>
          <Icon name='plus' color='white' type='entypo' />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleContainer: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 0
  },
  addOuterCircle: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#76BA1B',
    width: 75,
    height: 75,
    borderRadius: 50,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  addInnerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4C9A2A',
    width: 45,
    height: 45,
    borderRadius: 50,
  },
})

export default AddButton;