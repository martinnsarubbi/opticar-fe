import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SearchComponent = ({ onSearchEnter }) => {
  const [term, setTerm] = useState("");

  return (
    <View style={styles.searchWrapperStyle}>
      <Icon size={18} name="search" color="white" style={styles.iconStyle} />
      <TextInput
        placeholder="Buscar"
        placeholderTextColor="grey"
        style={styles.searchInputStyle}
        value={term}
        onChangeText={(newText) => {
          setTerm(newText);
        }}
        onEndEditing={() => {
          onSearchEnter(term);
        }}
      />
      <Icon
        size={18}
        name="close"
        color="white"
        style={styles.iconStyle}
        onPress={() => {
          setTerm("");
          onSearchEnter("");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchWrapperStyle: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 18,
    margin: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40
  },
  iconStyle: {
    marginTop: 11,
    marginHorizontal: 8,
    color: 'grey'
  },
  searchInputStyle: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    margin: 0,
    color: "grey",
  },
});

export default SearchComponent;