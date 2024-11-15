import { View, Text } from "react-native";

export default function ViewTripsScreen() {
  return (
    <View className="flex-1 bg-background dark:bg-dark-background p-6">
      <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground">
        View Trips
      </Text>
    </View>
  );
}