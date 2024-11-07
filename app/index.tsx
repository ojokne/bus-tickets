import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="bg-background dark:bg-dark-background p-4 rounded-lg">
      <Text className="text-foreground dark:text-dark-foreground">
        Hello, Tailwind and NativeWind!
      </Text>
    </View>
  );
}
