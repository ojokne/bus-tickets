import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  Text,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRoot } from "../../context";
import { useRouter } from "expo-router";
import { useState } from "react";

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function HomeScreen() {
  const { user } = useRoot();
  const router = useRouter();
  const [showRevenue, setShowRevenue] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="px-5 pt-12">
          {/* Top Bar */}
          <View className="flex-row justify-between mb-10 ">
            <View>
              <Text className="text-primary text-3xl font-bold tracking-wider">
                BusGo
              </Text>
              <Text className="text-gray-500 text-[15px] mt-1.5">
                Welcome back, {user?.email?.split("@")[0]}
              </Text>
            </View>
            <Pressable className="w-12 h-12 bg-primary/5 rounded-full items-center justify-center">
              <FontAwesome5 name="user" size={16} color="#000080" />
            </Pressable>
          </View>

          {/* Stats Row */}
          <View className="flex flex-row justify-between rounded-2xl mb-8">
            {/* Revenue Stats */}
            <View className="bg-primary  rounded-xl p-6 flex justify-center flex-grow mr-1">
              <View className="flex flex-row items-center justify-between  mb-3">
                <View className="mr-3">
                  <FontAwesome5 name="dollar-sign" size={18} color="#fff" />
                </View>
                <Text className="text-white text-[15px] font-medium">
                  Revenue
                </Text>
                <Pressable
                  onPress={() => setShowRevenue(!showRevenue)}
                  className="ml-3"
                >
                  <FontAwesome5
                    name={showRevenue ? "eye" : "eye-slash"}
                    size={16}
                    color="#fff"
                  />
                </Pressable>
              </View>
              <Text className="text-2xl font-bold text-white text-center">
                {showRevenue ? "$1,234" : "****"}
              </Text>
            </View>

            {/* Tickets Stats */}
            <View className="flex bg-primary rounded-xl p-6 flex-grow ml-1">
              <View className="flex-row items-center mb-3">
                <View className="mr-3">
                  <FontAwesome5 name="ticket-alt" size={18} color="#fff" />
                </View>
                <Text className="text-white text-[15px] font-medium">
                  Tickets
                </Text>
              </View>
              <Text className="text-2xl font-bold text-white text-center">
                24
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="-mt-6">
          <View className="bg-white rounded-3xl p-6 shadow-lg shadow-black/5">
            <AnimatedText
              entering={FadeInDown.duration(400).delay(200)}
              className="text-lg font-bold mb-6 text-foreground"
            >
              Quick Actions
            </AnimatedText>
            
            <View className="flex-row flex-wrap justify-between">
              {quickActions.map((action, index) => (
                <Animated.View
                  key={action.id}
                  entering={FadeInDown.duration(400).delay(100 + index * 50)}
                  className="w-[48%] mb-4"
                >
                  <Pressable
                    onPress={() => router.push(action.route as any)}
                    className="bg-background p-5 rounded-2xl border border-primary/5 active:opacity-90"
                  >
                    <View className="flex-row items-center mb-3">
                      <View className="w-11 h-11 bg-primary/5 rounded-xl items-center justify-center">
                        <FontAwesome5
                          name={action.icon}
                          size={18}
                          color="#000080"
                          solid
                        />
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="text-foreground font-semibold text-base">
                          {action.name}
                        </Text>
                        <Text className="text-muted-foreground text-xs">
                          Tap to access
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mt-6 mb-8">
          {/* Header with View All link */}
          <View className="flex-row justify-between items-center mb-4">
            <AnimatedText
              entering={FadeInDown.duration(400).delay(200)}
              className="text-lg font-bold text-foreground"
            >
              Recent Transactions
            </AnimatedText>
            <Pressable onPress={() => router.push("/(protected)/transactions" as any)}>
              <Text className="text-primary text-sm font-medium">View All</Text>
            </Pressable>
          </View>

          {/* Transactions List */}
          {recentTransactions.map((transaction, index) => (
            <Animated.View
              key={transaction.id}
              entering={FadeInDown.duration(400).delay(100 + index * 50)}
              className="bg-white p-4 rounded-2xl mb-3 border border-primary/5"
            >
              <View className="flex-row justify-between items-center">
                {/* Left Side */}
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-primary/5 rounded-full items-center justify-center mr-3">
                      <FontAwesome5 name="bus" size={14} color="#000080" />
                    </View>
                    <View>
                      <Text className="text-foreground font-semibold text-base">
                        {transaction.route}
                      </Text>
                      <Text className="text-muted-foreground text-xs mt-0.5">
                        {transaction.date} • #{transaction.ticketNo}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right Side */}
                <View className="items-end">
                  <Text className="text-primary font-bold text-base">
                    ${transaction.amount}
                  </Text>
                  <View className="bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                    <Text className="text-emerald-600 text-xs font-medium">
                      Completed
                    </Text>
                  </View>
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
    name: "Sell Ticket",
    icon: "ticket-alt",
    route: "/(protected)/sell-tickets",
  },
  {
    id: "2",
    name: "New Trip",
    icon: "plus-circle",
    route: "/(protected)/new-trip",
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
