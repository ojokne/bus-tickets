import { View, TextInput, Pressable, Text, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { Link, router } from "expo-router";
import Animated, { FadeInDown, FadeIn, FadeOut } from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { useRoot } from "@/context";

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function LoginScreen() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Error states
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const { signIn } = useRoot();

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  // Debounced validation handlers
  const debouncedEmailValidation = useCallback(
    debounce((text: string) => {
      if (touched.email) {
        setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
      }
    }, 800),
    [touched.email]
  );

  const debouncedPasswordValidation = useCallback(
    debounce((text: string) => {
      if (touched.password) {
        setErrors((prev) => ({ ...prev, password: validatePassword(text) }));
      }
    }, 800),
    [touched.password]
  );

  // Handle input changes
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!touched.email) {
      setTouched((prev) => ({ ...prev, email: true }));
    }
    setErrors({
      email: "",
      password: "",
    });
    debouncedEmailValidation(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!touched.password) {
      setTouched((prev) => ({ ...prev, password: true }));
    }
    setErrors({
      email: "",
      password: "",
    });
    debouncedPasswordValidation(text);
  };

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setTouched({ email: true, password: true });
    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      try {
        await signIn(email, password);
      } catch (error) {
        console.error('Login failed:', error);
        // Handle login error (show message to user, etc.)
      }
    }
  };

  // Error message component
  const ErrorMessage = ({ message }: { message: string }) =>
    message ? (
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      >
        <Text className="text-red-500 text-sm mt-1 ml-1">{message}</Text>
      </Animated.View>
    ) : null;

  return (
    <ScrollView className="flex-1 bg-background dark:bg-dark-background">
      <View className="p-6">
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(1000)}
          className="items-center mb-10 mt-16"
        >
          <FontAwesome5 name="bus-alt" size={60} color="#4ECDC4" />
          <AnimatedText className="text-foreground dark:text-dark-foreground text-3xl font-bold mt-4">
            Welcome Back
          </AnimatedText>
          <AnimatedText className="text-muted-foreground text-center mt-2">
            Sign in to your BusGo account
          </AnimatedText>
        </Animated.View>

        {/* Login Form */}
        <Animated.View
          entering={FadeInDown.duration(1000).delay(200)}
          className="space-y-6 mb-6"
        >
          {/* Email Input */}
          <View className="mb-4">
            <View className="border border-input dark:border-dark-input rounded-xl py-2">
              <View className="flex-row items-center">
                <View className="py-3 px-4 border-r border-input dark:border-dark-input">
                  <FontAwesome5 name="envelope" size={20} color="#4ECDC4" />
                </View>
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 py-3 px-4 text-foreground dark:text-dark-foreground"
                  placeholderTextColor="#666"
                />
              </View>
            </View>
            <ErrorMessage message={errors.email} />
          </View>

          {/* Password Input */}
          <View>
            <View className="border border-input dark:border-dark-input rounded-xl py-2">
              <View className="flex-row items-center">
                <View className="py-3 px-4 border-r border-input dark:border-dark-input">
                  <FontAwesome5 name="lock" size={20} color="#4ECDC4" />
                </View>
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  className="flex-1 py-3 px-4 text-foreground dark:text-dark-foreground"
                  placeholderTextColor="#666"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="px-4"
                >
                  <FontAwesome5
                    name={showPassword ? "eye-slash" : "eye"}
                    size={20}
                    color="#666"
                  />
                </Pressable>
              </View>
            </View>
            <ErrorMessage message={errors.password} />
          </View>

          {/* Login Button */}
          <Pressable
            onPress={handleLogin}
            className="bg-primary py-4 rounded-xl mt-2 mb-4"
          >
            <AnimatedText className="text-white text-center text-lg font-semibold">
              Sign In
            </AnimatedText>
          </Pressable>

          {/* Forgot Password Link */}
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable>
              <AnimatedText className="text-primary text-center">
                Forgot Password?
              </AnimatedText>
            </Pressable>
          </Link>
        </Animated.View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-4 mb-6">
          <AnimatedText className="text-muted-foreground">
            Don't have an account?{" "}
          </AnimatedText>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <AnimatedText className="text-primary font-semibold">
                Sign Up
              </AnimatedText>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
