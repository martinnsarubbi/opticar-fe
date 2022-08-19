import { View, StyleSheet, Text } from "react-native"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"

function GooglePlacesAutocompleteInput({label, style, placeholder}) {

  return(
    <View style={[styles.inputContainer, style]}>
      <Text style={styles.label}>{label}</Text>
      <GooglePlacesAutocomplete
        placeholder='Buscar'
        onPress={onPress}
        query={{
          key: GOOGLE_API_KEY,
          language: 'es',
        }}
        GooglePlacesDetailsQuery={{
          fields: 'address_component,geometry',
        }}
        fetchDetails={true}
        sytles={{
          textInput: styles.input
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 0,
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
})

export default GooglePlacesAutocompleteInput;