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

export default function ForgotPasswordScreen() {
  // Form state
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState({
    email: false,
  });

  // Error states
  const [errors, setErrors] = useState({
    email: "",
  });

  // Success state
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  // Debounced validation handler
  const debouncedEmailValidation = useCallback(
    debounce((text: string) => {
      if (touched.email) {
        setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
      }
    }, 800),
    [touched.email]
  );

  // Handle input changes
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!touched.email) {
      setTouched((prev) => ({ ...prev, email: true }));
    }
    setErrors({ email: "" });
    debouncedEmailValidation(text);
  };

  const handleSubmit = () => {
    setTouched({ email: true });
    const emailError = validateEmail(email);

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    // Proceed with password reset
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
  };

  // Updated Error message component without Layout
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

  if (isSubmitted) {
    return (
      <ScrollView className="flex-1 bg-background dark:bg-dark-background">
        <View className="p-6">
          <Animated.View
            entering={FadeInDown.duration(1000)}
            className="items-center mb-10 mt-16"
          >
            <FontAwesome5 name="check-circle" size={60} color="#4ECDC4" />
            <AnimatedText className="text-foreground dark:text-dark-foreground text-3xl font-bold mt-4">
              Check Your Email
            </AnimatedText>
            <AnimatedText className="text-muted-foreground text-center mt-2">
              We've sent password reset instructions to:
            </AnimatedText>
            <AnimatedText className="text-foreground dark:text-dark-foreground font-semibold mt-2">
              {email}
            </AnimatedText>
          </Animated.View>

          <Link href="/(auth)/login" asChild>
            <Pressable className="bg-primary py-4 rounded-xl mt-6">
              <AnimatedText className="text-white text-center text-lg font-semibold">
                Back to Login
              </AnimatedText>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background dark:bg-dark-background">
      <View className="p-6">
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(1000)}
          className="items-center mb-10 mt-16"
        >
          <FontAwesome5 name="lock" size={60} color="#4ECDC4" />
          <AnimatedText className="text-foreground dark:text-dark-foreground text-3xl font-bold mt-4">
            Forgot Password?
          </AnimatedText>
          <AnimatedText className="text-muted-foreground text-center mt-2">
            Enter your email to reset your password
          </AnimatedText>
        </Animated.View>

        {/* Form */}
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

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            className="bg-primary py-4 rounded-xl mt-2"
          >
            <AnimatedText className="text-white text-center text-lg font-semibold">
              Reset Password
            </AnimatedText>
          </Pressable>
        </Animated.View>

        {/* Back to Login */}
        <View className="flex-row justify-center mt-4 mb-6">
          <AnimatedText className="text-muted-foreground">
            Remember your password?{" "}
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
