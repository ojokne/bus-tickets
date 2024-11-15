import {
  View,
  Dimensions,
  Pressable,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  withDelay,
} from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";

const { width } = Dimensions.get("window");
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function OnboardingScreen() {
  const router = useRouter();
  const logoScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const featuresOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(100);

  useEffect(() => {
    // Logo animation
    logoScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });

    // Content fade in
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 1000 }));

    // Features fade in
    featuresOpacity.value = withDelay(600, withTiming(1, { duration: 1000 }));

    // Buttons slide up
    buttonsTranslateY.value = withDelay(
      800,
      withSpring(0, {
        damping: 15,
        stiffness: 100,
      })
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      {
        translateY: interpolate(contentOpacity.value, [0, 1], [20, 0]),
      },
    ],
  }));

  const featuresStyle = useAnimatedStyle(() => ({
    opacity: featuresOpacity.value,
    transform: [
      {
        translateY: interpolate(featuresOpacity.value, [0, 1], [20, 0]),
      },
    ],
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonsTranslateY.value }],
    opacity: interpolate(buttonsTranslateY.value, [100, 0], [0, 1]),
  }));

  return (
    <View className="flex-1 bg-background">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1">
          {/* Hero Section */}
          <View className="w-full h-[45%] items-center justify-center p-8">
            <Animated.View style={logoStyle} className="mb-8 p-6">
              <FontAwesome5 name="bus-alt" size={70} color="#000080" />
            </Animated.View>

            <Animated.View style={contentStyle}>
              <Animated.Text className="text-4xl font-bold text-foreground text-center tracking-tight">
                BusGo
              </Animated.Text>

              <Animated.Text className="text-xl text-muted-foreground text-center mt-3 tracking-wide">
                Your Journey, Our Priority
              </Animated.Text>
            </Animated.View>
          </View>

          <View className="flex-1 justify-end">
            {/* Features Section */}
            <Animated.View style={featuresStyle} className="px-8 mt-2 pb-16">
              {[
                {
                  icon: "ticket-alt",
                  text: "Easy ticket booking and management",
                },
                {
                  icon: "map-marked-alt",
                  text: "Real-time journey tracking",
                },
                { icon: "shield-alt", text: "Secure and reliable service" },
              ].map((feature) => (
                <View key={feature.icon} className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-background rounded-2xl items-center justify-center mr-4 shadow-sm">
                    <FontAwesome5
                      name={feature.icon}
                      size={22}
                      color="#000080"
                    />
                  </View>
                  <Animated.Text className="text-foreground flex-1 text-base">
                    {feature.text}
                  </Animated.Text>
                </View>
              ))}
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View style={buttonsStyle} className="px-8 pb-8">
              <AnimatedPressable
                onPress={() => router.push("/(auth)/register")}
                className="bg-primary rounded-2xl p-4 mb-4 shadow-sm"
              >
                <Animated.Text className="text-white text-center text-lg font-semibold tracking-wide">
                  Get Started
                </Animated.Text>
              </AnimatedPressable>

              <AnimatedPressable
                onPress={() => router.push("/(auth)/login")}
                className="bg-white border border-primary/10 rounded-2xl p-4 shadow-sm"
              >
                <Animated.Text className="text-primary text-center text-lg font-semibold tracking-wide">
                  I already have an account
                </Animated.Text>
              </AnimatedPressable>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
