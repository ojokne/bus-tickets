import { View, TextInput, Pressable, Text, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { Link } from "expo-router";
import Animated, {
  FadeInDown,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";
import debounce from "lodash/debounce";

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function RegisterScreen() {
  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Error states
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation functions
  const validateFullName = (name: string) => {
    if (!name.trim()) {
      return "Full name is required";
    }
    if (name.trim().length < 2) {
      return "Full name must be at least 2 characters";
    }
    return "";
  };

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

  const validateConfirmPassword = (confirmPass: string) => {
    if (!confirmPass) {
      return "Please confirm your password";
    }
    if (confirmPass !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  // Debounced validation handlers
  const debouncedValidation = {
    fullName: useCallback(
      debounce((text: string) => {
        if (touched.fullName) {
          setErrors((prev) => ({ ...prev, fullName: validateFullName(text) }));
        }
      }, 800),
      [touched.fullName]
    ),
    email: useCallback(
      debounce((text: string) => {
        if (touched.email) {
          setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
        }
      }, 800),
      [touched.email]
    ),
    password: useCallback(
      debounce((text: string) => {
        if (touched.password) {
          setErrors((prev) => ({ ...prev, password: validatePassword(text) }));
        }
      }, 800),
      [touched.password]
    ),
    confirmPassword: useCallback(
      debounce((text: string) => {
        if (touched.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(text),
          }));
        }
      }, 800),
      [touched.confirmPassword, password]
    ),
  };

  // Handle input changes
  const clearAllErrors = () => {
    setErrors({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    if (!touched.fullName) {
      setTouched((prev) => ({ ...prev, fullName: true }));
    }
    clearAllErrors();
    debouncedValidation.fullName(text);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!touched.email) {
      setTouched((prev) => ({ ...prev, email: true }));
    }
    clearAllErrors();
    debouncedValidation.email(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!touched.password) {
      setTouched((prev) => ({ ...prev, password: true }));
    }
    clearAllErrors();
    debouncedValidation.password(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (!touched.confirmPassword) {
      setTouched((prev) => ({ ...prev, confirmPassword: true }));
    }
    clearAllErrors();
    debouncedValidation.confirmPassword(text);
  };

  const handleRegister = () => {
    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const newErrors = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    // Proceed with registration
    console.log("Registration attempted with:", { fullName, email, password });
  };

  // Error message component
  const ErrorMessage = ({ message }: { message: string }) => (
    message ? (
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      >
        <Text className="text-red-500 text-sm mt-1 ml-1">
          {message}
        </Text>
      </Animated.View>
    ) : null
  );

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(1000)}
          className="items-center mb-10 mt-16"
        >
          <FontAwesome5 name="bus-alt" size={60} color="#000080" />
          <AnimatedText className="text-foreground text-3xl font-bold mt-4">
            Create Account
          </AnimatedText>
          <AnimatedText className="text-muted-foreground text-center mt-2">
            Join BusGo for easier travel
          </AnimatedText>
        </Animated.View>

        {/* Registration Form */}
        <Animated.View
          entering={FadeInDown.duration(1000).delay(200)}
          className="space-y-6 mb-6"
        >
          {/* Full Name Input */}
          <View className="mb-4">
            <View className="border border-input rounded-xl py-2">
              <View className="flex-row items-center">
                <View className="px-4 border-r border-input">
                  <FontAwesome5 name="user" size={20} color="#000080" />
                </View>
                <TextInput
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={handleFullNameChange}
                  className="flex-1 py-2 px-4 text-foreground"
                  placeholderTextColor="#666"
                  cursorColor="#000080"
                />
              </View>
            </View>
            <ErrorMessage message={errors.fullName} />
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <View className="border border-input rounded-xl py-2">
              <View className="flex-row items-center">
                <View className="px-4 border-r border-input">
                  <FontAwesome5 name="envelope" size={20} color="#000080" />
                </View>
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 py-2 px-4 text-foreground"
                  placeholderTextColor="#666"
                  cursorColor="#000080"
                />
              </View>
            </View>
            <ErrorMessage message={errors.email} />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <View className="border border-input rounded-xl py-2">
              <View className="flex-row items-center">
                <View className="px-4 border-r border-input">
                  <FontAwesome5 name="lock" size={20} color="#000080" />
                </View>
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  className="flex-1 py-2 px-4 text-foreground"
                  placeholderTextColor="#666"
                  cursorColor="#000080"
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

          {/* Confirm Password Input */}
          <View className="mb-4">
            <View className="border border-input rounded-xl py-2">
              <View className="flex-row items-center">
                <View className="px-4 border-r border-input">
                  <FontAwesome5 name="lock" size={20} color="#000080" />
                </View>
                <TextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  secureTextEntry={!showConfirmPassword}
                  className="flex-1 py-2 px-4 text-foreground"
                  placeholderTextColor="#666"
                  cursorColor="#000080"
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="px-4"
                >
                  <FontAwesome5
                    name={showConfirmPassword ? "eye-slash" : "eye"}
                    size={20}
                    color="#666"
                  />
                </Pressable>
              </View>
            </View>
            <ErrorMessage message={errors.confirmPassword} />
          </View>

          {/* Register Button */}
          <Pressable
            onPress={handleRegister}
            className="bg-primary py-4 rounded-xl mt-2 mb-6"
          >
            <AnimatedText className="text-white text-center text-lg font-semibold">
              Create Account
            </AnimatedText>
          </Pressable>

          {/* Terms and Conditions */}
          <AnimatedText className="text-muted-foreground text-center text-sm mb-8">
            By creating an account, you agree to our{" "}
            <Text className="text-primary">Terms of Service</Text> and{" "}
            <Text className="text-primary">Privacy Policy</Text>
          </AnimatedText>
        </Animated.View>

        {/* Login Link */}
        <View className="flex-row justify-center mt-4 mb-6">
          <AnimatedText className="text-muted-foreground">
            Already have an account?{" "}
          </AnimatedText>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <AnimatedText className="text-primary font-semibold">
                Sign In
              </AnimatedText>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
