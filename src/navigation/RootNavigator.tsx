import { DarkTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './navigation.types';
import { usePlayer } from '@/lib/data/hooks';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { HomePage } from '@/pages/home/HomePage';

const Stack = createNativeStackNavigator<RootStackParamList>();

const TRANSPARENT_SCREENS_THEME: Theme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: 'transparent' } };

export function RootNavigator() {
  const { player, loaded } = usePlayer();
  if (!loaded) return null;

  return (
    <NavigationContainer theme={TRANSPARENT_SCREENS_THEME}>
      <Stack.Navigator
        initialRouteName={player ? 'Home' : 'Register'}
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}
      >
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Home" component={HomePage} options={{ animation: 'fade' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
