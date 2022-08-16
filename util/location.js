import { MAP_TYPES } from "react-native-maps";

export function getLocationDetailsFromGoogleMapsJSON(json) {
  const locationDetails = {
    province: '',
    district: ''
  }
  for(let i = 0; i < json.address_components.length; i++) {
    if(json.address_components[i].hasOwnProperty('types')) {
      if(json.address_components[i].types.includes('administrative_area_level_1')) {
        locationDetails.province = json.address_components[i].short_name;
      }
      if(json.address_components[i].types.includes('administrative_area_level_2')) {
        locationDetails.district = json.address_components[i].short_name;
      }
    }
  }
  return locationDetails;
}