import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
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
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  driverName: string;
  conductorName: string;
}

const DUMMY_TRIP: Trip = {
  id: "1",
  from: "Nairobi",
  to: "Mombasa",
  date: "25/03/2024",
  time: "10:00 AM",
  busNumber: "KBZ 123A",
  price: "1200",
  totalSeats: "45",
  availableSeats: "30",
  status: "scheduled",
  driverName: "John Doe",
  conductorName: "Jane Smith",
};

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams();
  const trip = DUMMY_TRIP;

  // Add edit handler
  const handleEdit = () => {
    router.push({
      pathname: "/new-trip",
      params: {
        editMode: "true",
        tripId: id,
        from: trip.from,
        to: trip.to,
        date: trip.date,
        time: trip.time,
        busNumber: trip.busNumber,
        price: trip.price,
        totalSeats: trip.totalSeats,
        driverName: trip.driverName,
        conductorName: trip.conductorName
      }
    });
  };

  const getStatusColor = (status: Trip["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
    }
  };

  const handleStartTrip = () => {
    Alert.alert("Start Trip", "Are you sure you want to start this trip?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Start",
        onPress: () => {
          // Update trip status to 'in-progress'
          console.log("Trip started");
        },
      },
    ]);
  };

  const handleCancelTrip = () => {
    Alert.alert("Cancel Trip", "Are you sure you want to cancel this trip?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          // Update trip status to 'cancelled'
          console.log("Trip cancelled");
        },
      },
    ]);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView className="flex-1 bg-background pt-8">
        {/* Header */}
        <View className="border-b border-primary/5">
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                className="mr-4 p-2 rounded-full bg-primary/5"
              >
                <Ionicons name="arrow-back" size={24} color="#000080" />
              </Pressable>
              <View>
                <Text className="text-2xl font-bold text-foreground">
                  Trip Details
                </Text>
                <Text className="text-sm text-muted-foreground">
                  View and manage trip information
                </Text>
              </View>
            </View>
            {trip.status === "scheduled" && (
              <Pressable
                onPress={handleEdit}
                className="p-2 rounded-full bg-primary/5"
              >
                <Ionicons name="create-outline" size={24} color="#000080" />
              </Pressable>
            )}
          </View>
        </View>

        <ScrollView className="flex-1">
          <View className="p-4 space-y-6">
            {/* Status Badge */}
            <View className="items-center mb-3">
              <View
                className={`px-4 py-2 rounded-full ${getStatusColor(
                  trip.status
                )}`}
              >
                <Text className="text-sm font-medium capitalize">
                  {trip.status.replace("-", " ")}
                </Text>
              </View>
            </View>

            {/* Route Card */}
            <View className="bg-white rounded-xl p-4 border border-primary/5 mb-3">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-primary/5 items-center justify-center mr-2">
                  <Ionicons name="map-outline" size={24} color="#000080" />
                </View>
                <Text className="text-lg font-semibold text-foreground">
                  Route Details
                </Text>
              </View>

              <View className="space-y-4">
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-sm text-muted-foreground">From</Text>
                    <Text className="text-foreground font-medium">
                      {trip.from}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm text-muted-foreground">To</Text>
                    <Text className="text-foreground font-medium">
                      {trip.to}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-sm text-muted-foreground">Date</Text>
                    <Text className="text-foreground font-medium">
                      {trip.date}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm text-muted-foreground">Time</Text>
                    <Text className="text-foreground font-medium">
                      {trip.time}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Bus Details Card */}
            <View className="bg-white rounded-xl p-4 border border-primary/5 mb-3">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-primary/5 items-center justify-center mr-2">
                  <Ionicons name="bus-outline" size={24} color="#000080" />
                </View>
                <Text className="text-lg font-semibold text-foreground">
                  Bus Details
                </Text>
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="text-sm text-muted-foreground">
                    Bus Number
                  </Text>
                  <Text className="text-foreground font-medium">
                    {trip.busNumber}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-sm text-muted-foreground">
                      Driver
                    </Text>
                    <Text className="text-foreground font-medium">
                      {trip.driverName}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm text-muted-foreground">
                      Conductor
                    </Text>
                    <Text className="text-foreground font-medium">
                      {trip.conductorName}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Ticket Details Card */}
            <View className="bg-white rounded-xl p-4 border border-primary/5">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-primary/5 items-center justify-center mr-2">
                  <Ionicons name="ticket-outline" size={24} color="#000080" />
                </View>
                <Text className="text-lg font-semibold text-foreground">
                  Ticket Details
                </Text>
              </View>

              <View className="space-y-4">
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-sm text-muted-foreground">Price</Text>
                    <Text className="text-foreground font-medium">
                      KES {trip.price}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm text-muted-foreground">
                      Available Seats
                    </Text>
                    <Text className="text-foreground font-medium">
                      {trip.availableSeats}/{trip.totalSeats}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        {trip.status === "scheduled" && (
          <View className="p-4">
            <View className="flex-row space-x-4">
              <Pressable
                onPress={handleCancelTrip}
                className="flex-1 p-4 rounded-xl border border-red-500 me-1"
              >
                <Text className="text-red-500 font-semibold text-center">
                  Cancel Trip
                </Text>
              </Pressable>
              <Pressable
                onPress={handleStartTrip}
                className="flex-1 p-4 rounded-xl bg-primary ms-1"
              >
                <Text className="text-white font-semibold text-center">
                  Start Trip
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}
