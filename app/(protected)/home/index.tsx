import { View, ScrollView, Pressable, TextInput, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRoot } from "../../../context";
import { useRouter } from "expo-router";

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function HomeScreen() {
  const { user } = useRoot();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background dark:bg-dark-background">
      {/* Header Section */}
      <View className="bg-primary pt-12 pb-6 px-6 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <AnimatedText
              entering={FadeInDown.duration(1000)}
              className="text-white text-lg"
            >
              Agent Dashboard
            </AnimatedText>
            <AnimatedText
              entering={FadeInDown.duration(1000).delay(200)}
              className="text-white text-2xl font-bold"
            >
              {user?.email}
            </AnimatedText>
          </View>
          <Pressable className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
            <FontAwesome5 name="user" size={20} color="white" />
          </Pressable>
        </View>

        {/* Quick Stats */}
        <Animated.View
          entering={FadeInDown.duration(1000).delay(100)}
          className="flex-row justify-between mt-4"
        >
          <View className="bg-white dark:bg-dark-background rounded-xl p-4 flex-1 mr-2">
            <Text className="text-muted-foreground text-sm">Today's Sales</Text>
            <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground">
              $1,234
            </Text>
          </View>
          <View className="bg-white dark:bg-dark-background rounded-xl p-4 flex-1 ml-2">
            <Text className="text-muted-foreground text-sm">Tickets Sold</Text>
            <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground">
              24
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 mt-6">
        <AnimatedText
          entering={FadeInDown.duration(1000).delay(200)}
          className="text-xl font-bold mb-4 text-foreground dark:text-dark-foreground"
        >
          Quick Actions
        </AnimatedText>
        <View className="flex-row flex-wrap justify-between">
          {quickActions.map((action, index) => (
            <Animated.View
              key={action.id}
              entering={FadeInDown.duration(1000).delay(400 + index * 100)}
              className="w-[48%] mb-4"
            >
              <Pressable
                onPress={() => router.push(action.route as any)}
                className="bg-card dark:bg-dark-card p-4 rounded-xl items-center"
              >
                <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mb-2">
                  <FontAwesome5 name={action.icon} size={24} color="#4ECDC4" />
                </View>
                <Text className="text-foreground dark:text-dark-foreground font-semibold text-center">
                  {action.name}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View className="px-6 mt-4 mb-6">
        <AnimatedText
          entering={FadeInDown.duration(1000).delay(300)}
          className="text-xl font-bold mb-4 text-foreground dark:text-dark-foreground"
        >
          Recent Transactions
        </AnimatedText>
        {recentTransactions.map((transaction, index) => (
          <Animated.View
            key={transaction.id}
            entering={FadeInDown.duration(1000).delay(800 + index * 100)}
            className="bg-card dark:bg-dark-card p-4 rounded-xl mb-3"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-foreground dark:text-dark-foreground font-semibold">
                  {transaction.route}
                </Text>
                <Text className="text-muted-foreground text-sm">
                  {transaction.date} • Ticket #{transaction.ticketNo}
                </Text>
              </View>
              <Text className="text-primary font-bold">
                ${transaction.amount}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const quickActions = [
  {
    id: "1",
    name: "New Trip",
    icon: "plus-circle",
    route: "/(protected)/new-trip",
  },
  {
    id: "2",
    name: "Sell Ticket",
    icon: "ticket-alt",
    route: "/(protected)/sell-tickets",
  },
  {
    id: "3",
    name: "View Trips",
    icon: "route",
    route: "/(protected)/view-trips",
  },
  {
    id: "4",
    name: "Reports",
    icon: "chart-bar",
    route: "/(protected)/reports",
  },
];

const recentTransactions = [
  {
    id: "1",
    route: "New York → Boston",
    date: "Today 14:30",
    ticketNo: "12345",
    amount: "45.00",
  },
  {
    id: "2",
    route: "Boston → Washington",
    date: "Today 12:15",
    ticketNo: "12344",
    amount: "65.00",
  },
  {
    id: "3",
    route: "Washington → Philadelphia",
    date: "Today 10:00",
    ticketNo: "12343",
    amount: "35.00",
  },
];
