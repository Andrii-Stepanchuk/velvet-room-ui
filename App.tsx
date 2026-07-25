import './src/global.css';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  ChakraPetch_500Medium,
  ChakraPetch_700Bold,
  ChakraPetch_700Bold_Italic,
} from '@expo-google-fonts/chakra-petch';
import {
  Barlow_400Regular,
  Barlow_400Regular_Italic,
  Barlow_500Medium,
  Barlow_700Bold,
} from '@expo-google-fonts/barlow';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    ChakraPetch_500Medium,
    ChakraPetch_700Bold,
    ChakraPetch_700Bold_Italic,
    Barlow_400Regular,
    Barlow_400Regular_Italic,
    Barlow_500Medium,
    Barlow_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
