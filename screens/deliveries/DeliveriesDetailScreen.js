import { View, Text } from 'react-native';

function DeliveriesDetailScreen(props) {

  console.log(props.route.params.itemData.productName)

  return (
    <View>
      <Text>DeliveriesDetail</Text>
      <Text>{props.route.params.itemData.productName}</Text>
      
    </View>
  );
}

export default DeliveriesDetailScreen;