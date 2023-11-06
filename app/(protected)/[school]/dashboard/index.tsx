import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Appearance, useColorScheme } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
      <Text className='text-text-light dark:text-text-dark'>Dash</Text>
    </View>
  );
}
