import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Screens
import { Home } from './screens/Home';
import { Library } from './screens/Library';
import { Settings } from './screens/Settings';
import { QuizSetup } from './screens/QuizSetup';
import { Processing } from './screens/Processing';
import { QuizActive } from './screens/QuizActive';
import { Summary } from './screens/Summary';
import { ReviewMissed } from './screens/ReviewMissed';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#23220f" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#23220f' },
            animation: 'none'
          }}
          initialRouteName="Home"
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Library" component={Library} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="QuizSetup" component={QuizSetup} />
          <Stack.Screen name="Processing" component={Processing} />
          <Stack.Screen name="QuizActive" component={QuizActive} />
          <Stack.Screen name="Summary" component={Summary} />
          <Stack.Screen name="ReviewMissed" component={ReviewMissed} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;