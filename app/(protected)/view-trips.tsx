import { View, Text, SafeAreaView, Pressable, TextInput, ScrollView, RefreshControl } from "react-native";
import { useState, useMemo } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// This will come from your API/database later
interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  busNumber: string;
  price: string;
  totalSeats: string;
  availableSeats: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

const DUMMY_TRIPS: Trip[] = [
  {
    id: '1',
    from: 'Nairobi',
    to: 'Mombasa',
    date: '25/03/2024',
    time: '10:00 AM',
    busNumber: 'KBZ 123A',
    price: '1200',
    totalSeats: '45',
    availableSeats: '30',
    status: 'scheduled'
  },
  // Add more dummy trips
];

export default function ViewTripsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [trips] = useState<Trip[]>(DUMMY_TRIPS);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        trip.from.toLowerCase().includes(searchLower) ||
        trip.to.toLowerCase().includes(searchLower) ||
        trip.busNumber.toLowerCase().includes(searchLower) ||
        trip.date.toLowerCase().includes(searchLower)
      );
    });
  }, [trips, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch trips from API here
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      {/* Header */}
      <View className="border-b border-primary/5">
        <View className="flex-row items-center justify-between p-4">
          <View>
            <Text className="text-2xl font-bold text-foreground">
              View Trips
            </Text>
            <Text className="text-sm text-muted-foreground">
              Manage your scheduled trips
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/new-trip")}
            className="p-2 rounded-full bg-primary/5"
          >
            <Ionicons name="add" size={24} color="#000080" />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="px-4 pb-4">
          <View className="border border-primary/5 rounded-xl flex-row items-center px-4">
            <Ionicons name="search" size={20} color="#5959A6" />
            <TextInput
              placeholder="Search trips..."
              placeholderTextColor="#5959A6"
              className="flex-1 py-3 px-2 text-foreground"
              value={searchQuery}
              onChangeText={setSearchQuery}
              cursorColor="#000080"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#5959A6" />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* Trips List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 space-y-4">
          {filteredTrips.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-muted-foreground">No trips found</Text>
            </View>
          ) : (
            filteredTrips.map((trip) => (
              <Pressable
                key={trip.id}
                onPress={() => router.push(`/(protected)/trip/${trip.id}` as any)}
                className="bg-white rounded-xl p-4 border border-primary/5"
              >
                {/* Route and Date */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-lg font-semibold text-foreground">
                        {trip.from}
                      </Text>
                      <Ionicons name="arrow-forward" size={20} color="#5959A6" className="mx-2" />
                      <Text className="text-lg font-semibold text-foreground">
                        {trip.to}
                      </Text>
                    </View>
                    <Text className="text-sm text-muted-foreground">
                      {trip.date} • {trip.time}
                    </Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(trip.status)}`}>
                    <Text className="text-xs font-medium capitalize">
                      {trip.status.replace('-', ' ')}
                    </Text>
                  </View>
                </View>

                {/* Bus Details */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Ionicons name="bus-outline" size={20} color="#5959A6" />
                    <Text className="ml-2 text-muted-foreground">
                      {trip.busNumber}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-primary font-semibold">
                      KES {trip.price}
                    </Text>
                    <Text className="text-muted-foreground ml-2">
                      • {trip.availableSeats}/{trip.totalSeats} seats
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}