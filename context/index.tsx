import { createContext, useContext, ReactNode, useState } from "react";
import { useRouter } from "expo-router";

interface User {
  id: string;
  email: string;
}

interface ContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const RootContext = createContext<ContextType | undefined>(undefined);

export function RootProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Your authentication logic here
      setUser({ id: "1", email }); // Replace with actual user data
      router.replace("/(protected)/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
  };

  return <RootContext.Provider value={value}>{children}</RootContext.Provider>;
}

export function useRoot() {
  const context = useContext(RootContext);
  if (context === undefined) {
    throw new Error("useRoot must be used within a RootProvider");
  }
  return context;
}
