import { DarkTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { RootStackParamList } from './navigation.types';
import { usePlayer } from '@/lib/data/hooks';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { MenuPage } from '@/pages/menu/MenuPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { StatusPage } from '@/pages/status/StatusPage';

const Stack = createNativeStackNavigator<RootStackParamList>();

const TRANSPARENT_SCREENS_THEME: Theme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: 'transparent' } };

const IN_SCENE: NativeStackNavigationOptions = { animation: 'none', gestureEnabled: false };

export function RootNavigator() {
  const { player, loaded } = usePlayer();
  if (!loaded) return null;

  return (
    <NavigationContainer theme={TRANSPARENT_SCREENS_THEME}>
      <Stack.Navigator
        initialRouteName={player ? 'Status' : 'Register'}
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}
      >
        <Stack.Screen name="Register" component={RegisterPage} options={{ animation: 'fade' }} />
        <Stack.Screen name="Status" component={StatusPage} options={{ animation: 'fade' }} />
        <Stack.Screen name="Menu" component={MenuPage} options={IN_SCENE} />
        <Stack.Screen name="Settings" component={SettingsPage} options={IN_SCENE} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
