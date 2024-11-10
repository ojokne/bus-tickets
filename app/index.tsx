import { View, Dimensions, Pressable } from "react-native";
import { Link, router, useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      {/* Hero Section */}
      <AnimatedGradient
        colors={["rgba(78, 205, 196, 0.2)", "transparent"]}
        className="w-full h-3/5 items-center justify-center p-6"
        entering={FadeInDown.duration(1000)}
      >
        <Animated.View entering={SlideInRight.duration(1000)} className="mb-8">
          <FontAwesome5 name="bus-alt" size={100} color="#4ECDC4" />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(1000).delay(300)}
          className="text-4xl font-bold text-foreground dark:text-dark-foreground text-center"
        >
          BusGo
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.duration(1000).delay(400)}
          className="text-xl text-muted-foreground text-center mt-2"
        >
          Your Journey, Our Priority
        </Animated.Text>
      </AnimatedGradient>

      {/* Features Section */}
      <Animated.View
        entering={FadeInUp.duration(1000).delay(600)}
        className="px-6 mb-8"
      >
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4">
            <FontAwesome5 name="ticket-alt" size={20} color="#4ECDC4" />
          </View>
          <Animated.Text className="text-foreground dark:text-dark-foreground flex-1">
            Easy ticket booking and management
          </Animated.Text>
        </View>

        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4">
            <FontAwesome5 name="map-marked-alt" size={20} color="#4ECDC4" />
          </View>
          <Animated.Text className="text-foreground dark:text-dark-foreground flex-1">
            Real-time journey tracking
          </Animated.Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4">
            <FontAwesome5 name="shield-alt" size={20} color="#4ECDC4" />
          </View>
          <Animated.Text className="text-foreground dark:text-dark-foreground flex-1">
            Secure and reliable service
          </Animated.Text>
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        entering={FadeInUp.duration(1000).delay(800)}
        className="px-6 space-y-4"
      >
        <Pressable
          onPress={() => router.push('/(auth)/register')}
          className="bg-primary rounded-xl p-4 mb-4"
        >
          <Animated.Text className="text-white text-center text-lg font-semibold">
            Get Started
          </Animated.Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="border border-primary rounded-xl p-4"
        >
          <Animated.Text className="text-primary text-center text-lg font-semibold">
            I already have an account
          </Animated.Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
