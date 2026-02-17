import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './components/HomeScreen';
import CategoriasScreen from './components/CategoriasScreen';
import ServicosScreen from './components/ServicosScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Gerenciar Categorias" component={CategoriasScreen} />
        <Drawer.Screen name="Gerenciar Serviços" component={ServicosScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
