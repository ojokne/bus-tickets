import { useRoot } from '@/context';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useRoot();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoading) {
      // If the user is not authenticated and not in auth group,
      // redirect to the login screen
      if (!isAuthenticated && !inAuthGroup) {
        router.replace('/login');
      } else if (isAuthenticated && inAuthGroup) {
        // If the user is authenticated and in auth group,
        // redirect to the main app
        router.replace('/');
      }
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return null; // Or your loading component
  }

  return <Slot />;
}