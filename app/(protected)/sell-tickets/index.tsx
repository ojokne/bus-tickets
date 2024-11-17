import { View, Text, SafeAreaView, Pressable, ScrollView, TextInput, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

interface Trip {
  id: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  busNumber: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  status: 'scheduled' | 'boarding' | 'departed' | 'completed';
  duration: string;
  from: string;
  to: string;
}

const DUMMY_TRIPS: Trip[] = [
  {
    id: '1',
    route: 'Nairobi → Mombasa',
    from: 'Nairobi',
    to: 'Mombasa',
    departureTime: '10:00 AM',
    arrivalTime: '4:00 PM',
    date: '2024-03-20',
    busNumber: 'KBZ 123A',
    availableSeats: 25,
    totalSeats: 45,
    price: 1200,
    status: 'scheduled',
    duration: '6h'
  },
  {
    id: '2',
    route: 'Nairobi → Kisumu',
    from: 'Nairobi',
    to: 'Kisumu',
    departureTime: '11:30 AM',
    arrivalTime: '6:30 PM',
    date: '2024-03-21',
    busNumber: 'KCY 456B',
    availableSeats: 15,
    totalSeats: 45,
    price: 1500,
    status: 'boarding',
    duration: '7h'
  },
  // Add more dummy trips...
];

export default function SellTicketScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTrips = DUMMY_TRIPS.filter(trip => 
    trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.busNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView className="flex-1 bg-background pt-8">
        <View className="p-4 border-b border-border bg-white">
          <View className="flex-row items-center mb-4">
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center"
            >
              <Ionicons name="arrow-back" size={24} color="#000080" className="bg-primary/5 rounded-full p-2" />
            </Pressable>
            <Text className="ml-2 text-2xl font-bold text-foreground">Sell Ticket</Text>
          </View>
          
          {/* Search Bar */}
          <View className="mt-4 flex-row items-center bg-muted/50 rounded-lg px-4 py-2">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-foreground"
              placeholder="Search routes or bus number..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView className="flex-1 px-4 pt-4">
          {filteredTrips.map(trip => (
            <Pressable
              key={trip.id}
              onPress={() => router.push(`/sell-tickets/${trip.id}`)}
              className="bg-white rounded-xl mb-4 overflow-hidden border border-primary/5"
            >
              {/* Status Bar */}
              <View className={`px-4 py-1.5 ${
                trip.status === 'scheduled' ? 'bg-blue-500' :
                trip.status === 'boarding' ? 'bg-green-500' :
                trip.status === 'departed' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}>
                <Text className="text-xs font-medium text-white capitalize">
                  {trip.status}
                </Text>
              </View>

              {/* Main Content */}
              <View className="p-4">
                {/* Route and Time */}
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1">
                    <View className="flex-row items-center space-x-2">
                      <View className="w-2 h-2 rounded-full bg-primary" />
                      <Text className="text-base font-medium">{trip.from}</Text>
                    </View>
                    <View className="ml-[5px] h-4 border-l border-dashed border-gray-300" />
                    <View className="flex-row items-center space-x-2">
                      <View className="w-2 h-2 rounded-full bg-gray-400" />
                      <Text className="text-base font-medium">{trip.to}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm text-muted-foreground">{trip.departureTime}</Text>
                    <View className="h-4 flex items-center justify-center">
                      <Text className="text-xs text-muted-foreground">{trip.duration}</Text>
                    </View>
                    <Text className="text-sm text-muted-foreground">{trip.arrivalTime}</Text>
                  </View>
                </View>

                {/* Details Row */}
                <View className="flex-row items-center justify-between pb-3 border-b border-border">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text className="ml-1 text-sm text-muted-foreground">
                      {new Date(trip.date).toLocaleDateString('en-US', { 
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="bus-outline" size={16} color="#666" />
                    <Text className="ml-1 text-sm text-muted-foreground">
                      {trip.busNumber}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="people-outline" size={16} color="#666" />
                    <Text className="ml-1 text-sm text-muted-foreground">
                      {trip.availableSeats} seats
                    </Text>
                  </View>
                </View>

                {/* Price and Progress */}
                <View className="flex-row items-center justify-between pt-3">
                  <Text className="text-lg font-semibold text-primary">
                    KES {trip.price.toLocaleString()}
                  </Text>
                  <View className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <View 
                      className="h-full bg-primary"
                      style={{ 
                        width: `${((trip.totalSeats - trip.availableSeats) / trip.totalSeats) * 100}%` 
                      }}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
} 