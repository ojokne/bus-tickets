import { View, ScrollView, Pressable, TextInput, Text, StatusBar, SafeAreaView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRoot } from "../../../context";
import { useRouter } from "expo-router";

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function HomeScreen() {
  const { user } = useRoot();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="px-5 pt-6">
          {/* Top Bar */}
          <View className="flex-row justify-between items-center mb-10">
            <View>
              <Text className="text-primary text-2xl font-bold tracking-tight">
                BusGo
              </Text>
              <Text className="text-gray-500 text-[15px] mt-1.5">
                Welcome back, {user?.email?.split('@')[0]}
              </Text>
            </View>
            <Pressable className="w-12 h-12 bg-primary/5 rounded-full items-center justify-center">
              <FontAwesome5 name="user" size={16} color="#000080" />
            </Pressable>
          </View>

          {/* Stats Row */}
          <View className="flex-row justify-between bg-white rounded-2xl shadow-sm mb-8">
            {/* Revenue Stats */}
            <View className="flex-1 border-r border-gray-100 p-6">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-primary/5 rounded-full items-center justify-center mr-3">
                  <FontAwesome5 name="dollar-sign" size={16} color="#000080" />
                </View>
                <Text className="text-gray-500 text-[15px]">Revenue</Text>
              </View>
              <Text className="text-2xl font-bold text-foreground ml-[52px]">$1,234</Text>
            </View>

            {/* Tickets Stats */}
            <View className="flex-1 p-6">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-primary/5 rounded-full items-center justify-center mr-3">
                  <FontAwesome5 name="ticket-alt" size={16} color="#000080" />
                </View>
                <Text className="text-gray-500 text-[15px]">Tickets</Text>
              </View>
              <Text className="text-2xl font-bold text-foreground ml-[52px]">24</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 -mt-6">
          <View className="bg-white rounded-3xl p-6 shadow-lg shadow-black/5">
            <AnimatedText
              entering={FadeInDown.duration(1000).delay(200)}
              className="text-lg font-bold mb-4 text-foreground"
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
                    className="bg-background p-4 rounded-2xl border border-primary/10"
                  >
                    <View className="w-12 h-12 bg-primary/5 rounded-xl items-center justify-center mb-3">
                      <FontAwesome5 name={action.icon} size={20} color="#000080" solid />
                    </View>
                    <Text className="text-foreground font-semibold">
                      {action.name}
                    </Text>
                    <Text className="text-muted-foreground text-xs mt-1">
                      Tap to access
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mt-6 mb-8">
          <AnimatedText
            entering={FadeInDown.duration(1000).delay(300)}
            className="text-lg font-bold mb-4 text-foreground"
          >
            Recent Transactions
          </AnimatedText>
          {recentTransactions.map((transaction, index) => (
            <Animated.View
              key={transaction.id}
              entering={FadeInDown.duration(1000).delay(800 + index * 100)}
              className="bg-white p-4 rounded-2xl mb-3 border border-primary/5"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold text-base">
                    {transaction.route}
                  </Text>
                  <Text className="text-muted-foreground text-sm mt-1">
                    {transaction.date} • #{transaction.ticketNo}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-primary font-bold text-base">
                    ${transaction.amount}
                  </Text>
                  <Text className="text-muted-foreground text-xs mt-1">
                    Completed
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
