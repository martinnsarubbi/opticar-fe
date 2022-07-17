import { Text, TextInput, View, StyleSheet } from 'react-native';


function Input({label, style, textInputConfig, placeholder}) {
  return(
    <View style={[styles.inputContainer, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        {...textInputConfig}
        placeholder={placeholder}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 16,
    flex: 1
  },
  label: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 4,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    color: 'black'
  }
});