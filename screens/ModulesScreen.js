import { FlatList } from 'react-native';
import ModuleGridTitle from '../components/ModuleGridTitle';

import { MODULES } from '../data/dummy-data';

function ModulesScreen({ navigation }) {
  function renderModuleItem(itemData) {
    function pressHandler() {
      navigation.navigate(itemData.item.screen)
    }
  
    return (
      <ModuleGridTitle
        title={itemData.item.title}
        color={itemData.item.color}
        iconImage={itemData.item.iconImage}
        onPress={pressHandler}
      />);
  }

  return (
    <FlatList
      data={MODULES}
      keyExtractor={(item) => item.id}
      renderItem={renderModuleItem}
      numColumns={2}
    />
  );
}
export default ModulesScreen;