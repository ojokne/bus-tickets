import { View, Text, SafeAreaView, Pressable, ScrollView, StatusBar, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useMemo } from "react";

interface Bus {
  id: string;
  busNumber: string;
  route: string;
  driver: string;
  status: 'on-time' | 'delayed' | 'stopped';
  location: string;
  nextStop: string;
}

const DUMMY_BUSES: Bus[] = [
  {
    id: '1',
    busNumber: 'KBZ 123A',
    route: 'Nairobi → Mombasa',
    driver: 'John Doe',
    status: 'on-time',
    location: 'Mtito Andei',
    nextStop: 'Voi'
  },
  {
    id: '2',
    busNumber: 'KCY 456B',
    route: 'Nairobi → Kisumu',
    driver: 'Jane Smith',
    status: 'delayed',
    location: 'Nakuru',
    nextStop: 'Kericho'
  },
  {
    id: '3',
    busNumber: 'KDG 789C',
    route: 'Mombasa → Malindi',
    driver: 'Mike Johnson',
    status: 'on-time',
    location: 'Kilifi',
    nextStop: 'Malindi'
  },
  // Add more dummy data as needed
];

export default function BusListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Memoized filtered buses
  const filteredBuses = useMemo(() => {
    if (!searchQuery.trim()) return DUMMY_BUSES;

    const query = searchQuery.toLowerCase().trim();
    return DUMMY_BUSES.filter(bus => 
      bus.busNumber.toLowerCase().includes(query) ||
      bus.route.toLowerCase().includes(query) ||
      bus.driver.toLowerCase().includes(query) ||
      bus.location.toLowerCase().includes(query) ||
      bus.nextStop.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-green-50 text-green-700';
      case 'delayed': return 'bg-yellow-50 text-yellow-700';
      case 'stopped': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView className="flex-1 bg-background pt-8">
        <View className="border-b border-primary/5">
          <View className="p-4">
            <View className="flex-row items-center mb-4">
              <Pressable
                onPress={() => router.back()}
                className="p-2 rounded-full bg-primary/5 mr-3"
              >
                <Ionicons name="arrow-back" size={24} color="#000080" />
              </Pressable>
              <View>
                <Text className="text-2xl font-bold text-foreground">Active Buses</Text>
                <Text className="text-sm text-muted-foreground">
                  {filteredBuses.length} buses found
                </Text>
              </View>
            </View>

            {/* Search Bar */}
            <View 
              className={`flex-row items-center bg-white rounded-xl border p-2 mb-2
                ${searchFocused ? 'border-primary' : 'border-primary/5'}`}
            >
              <Ionicons 
                name="search" 
                size={20} 
                color={searchFocused ? '#000080' : '#666'} 
              />
              <TextInput
                placeholder="Search by bus number, route, or location"
                className="flex-1 ml-2 text-foreground"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                clearButtonMode="while-editing"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery !== '' && (
                <Pressable 
                  onPress={() => setSearchQuery('')}
                  className="p-2"
                >
                  <Ionicons name="close-circle" size={20} color="#666" />
                </Pressable>
              )}
            </View>

            {/* Search Suggestions */}
            {searchQuery !== '' && filteredBuses.length === 0 && (
              <View className="bg-white rounded-xl p-4 mt-2">
                <Text className="text-muted-foreground text-center">
                  No buses found matching "{searchQuery}"
                </Text>
              </View>
            )}
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          {filteredBuses.map((bus) => (
            <Pressable
              key={bus.id}
              onPress={() => router.push(`/track-bus/${bus.id}`)}
              className="bg-white p-4 rounded-xl border border-primary/5 mb-4 active:bg-primary/5"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-lg font-semibold text-foreground">
                    {bus.busNumber}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {bus.route}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${getStatusColor(bus.status)}`}>
                  <Text className="text-xs font-medium capitalize">{bus.status}</Text>
                </View>
              </View>

              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Current Location</Text>
                  <Text className="text-foreground font-medium">{bus.location}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Next Stop</Text>
                  <Text className="text-foreground font-medium">{bus.nextStop}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Driver</Text>
                  <Text className="text-foreground font-medium">{bus.driver}</Text>
                </View>
              </View>

              <View className="mt-3 p-3 bg-primary/5 rounded-lg flex-row items-center justify-center">
                <Ionicons name="map-outline" size={20} color="#000080" />
                <Text className="text-primary font-medium ml-2">Track Location</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
} 