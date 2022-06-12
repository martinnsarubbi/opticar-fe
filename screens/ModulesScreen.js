import { FlatList } from 'react-native';
import ModuleGridTitle from '../components/ModuleGridTitle';

import { MODULES } from '../data/dummy-data';

function renderModuleItem(itemData) {
  return (
    <ModuleGridTitle
      title={itemData.item.title}
      color={itemData.item.color}
      iconImage={itemData.item.iconImage}
    />);;
}

function ModulesScreen() {
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