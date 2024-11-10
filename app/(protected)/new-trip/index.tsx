import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  TextInput,
  Modal,
  StatusBar,
} from "react-native";
import { useState, useMemo } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Add available locations
const LOCATIONS = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Thika",
  "Kitale",
  "Malindi",
  "Garissa",
  // Add more locations as needed
];

interface TripFormData {
  from: string;
  to: string;
  date: string;
  time: string;
  busNumber: string;
  price: string;
  totalSeats: string;
  driverName: string;
  conductorName: string;
}

const LocationSelector = ({
  visible,
  onClose,
  onSelect,
  title,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
  title: string;
}) => {
  const [localSearch, setLocalSearch] = useState("");

  const filteredLocations = useMemo(
    () =>
      LOCATIONS.filter((location) =>
        location.toLowerCase().includes(localSearch.toLowerCase())
      ),
    [localSearch]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <View className="flex-1 bg-white dark:bg-gray-900">
        <SafeAreaView className="flex-1">
          <View className="flex-1">
            {/* Fixed Header with extra padding */}
            <View className="pt-10 px-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-lg font-semibold text-center text-foreground dark:text-white flex-1">
                  {title}
                </Text>
                <Pressable
                  onPress={() => {
                    setLocalSearch("");
                    onClose();
                  }}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  <Ionicons name="close" size={20} color="#666" />
                </Pressable>
              </View>

              {/* Search Bar */}
              <View className="bg-gray-100 dark:bg-gray-800 rounded-xl flex-row items-center px-4">
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  placeholder="Search location..."
                  placeholderTextColor="#666"
                  className="flex-1 py-3 px-2 text-foreground dark:text-white"
                  value={localSearch}
                  onChangeText={setLocalSearch}
                  autoFocus
                />
                {localSearch.length > 0 && (
                  <Pressable onPress={() => setLocalSearch("")}>
                    <Ionicons name="close-circle" size={20} color="#666" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Location List */}
            <ScrollView
              className="flex-1 px-4"
              keyboardShouldPersistTaps="handled"
            >
              {filteredLocations.length === 0 ? (
                <View className="py-8 items-center">
                  <Text className="text-gray-500 dark:text-gray-400">
                    No locations found
                  </Text>
                </View>
              ) : (
                filteredLocations.map((location) => (
                  <Pressable
                    key={location}
                    onPress={() => {
                      onSelect(location);
                      setLocalSearch("");
                      onClose();
                    }}
                    className="py-4 border-b border-gray-200 dark:border-gray-800 flex-row justify-between items-center"
                  >
                    <View className="flex-row items-center">
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color="#4ECDC4"
                        className="mr-2"
                      />
                      <Text className="text-foreground dark:text-white text-lg">
                        {location}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default function NewTripScreen() {
  const [formData, setFormData] = useState<TripFormData>({
    from: "",
    to: "",
    date: "",
    time: "",
    busNumber: "",
    price: "",
    totalSeats: "45",
    driverName: "",
    conductorName: "",
  });

  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);

  const handleSubmit = async () => {
    try {
      console.log("Submitting trip data:", formData);
      router.back();
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 pt-6">
      {/* Header */}
      <View className="border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <View className="flex-row items-center p-4">
          <Pressable
            onPress={() => router.back()}
            className="mr-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <Ionicons name="arrow-back" size={24} color="#4ECDC4" />
          </Pressable>
          <View>
            <Text className="text-2xl font-bold text-foreground dark:text-white">
              Create New Trip
            </Text>
            <Text className="text-sm text-muted-foreground dark:text-gray-400">
              Fill in the trip details below
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 space-y-6">
          {/* Route Information Card */}
          <View className="bg-blue-50/50 dark:bg-gray-800/50 rounded-2xl p-4 mb-4 border border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 items-center justify-center mr-2">
                <Ionicons name="map-outline" size={24} color="#4ECDC4" />
              </View>
              <Text className="text-lg font-semibold text-foreground dark:text-white">
                Route Information
              </Text>
            </View>

            <View className="space-y-4">
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-1.5 text-foreground dark:text-white">
                    From
                  </Text>
                  <Pressable
                    onPress={() => setShowFromModal(true)}
                    className="bg-white dark:bg-gray-900 px-4 py-3 me-1 rounded-xl 
                      border border-gray-200 dark:border-gray-700 flex-row justify-between items-center"
                  >
                    <Text
                      className={`${
                        formData.from
                          ? "text-foreground dark:text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {formData.from || "From"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                  </Pressable>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-1.5 text-foreground dark:text-white">
                    To
                  </Text>
                  <Pressable
                    onPress={() => setShowToModal(true)}
                    className="bg-white dark:bg-gray-900 px-4 py-3 ms-1 rounded-xl 
                      border border-gray-200 dark:border-gray-700 flex-row justify-between items-center"
                  >
                    <Text
                      className={`${
                        formData.to
                          ? "text-foreground dark:text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {formData.to || "To"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                  </Pressable>
                </View>
              </View>

              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-1.5 text-foreground dark:text-dark-foreground">
                    Date
                  </Text>
                  <TextInput
                    value={formData.date}
                    onChangeText={(text) =>
                      setFormData({ ...formData, date: text })
                    }
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#666"
                    className="bg-white dark:bg-gray-900 px-4 py-3 rounded-xl 
                      border border-gray-200 dark:border-gray-700 text-foreground dark:text-gray-100 me-1"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-1.5 text-foreground dark:text-dark-foreground">
                    Time
                  </Text>
                  <TextInput
                    value={formData.time}
                    onChangeText={(text) =>
                      setFormData({ ...formData, time: text })
                    }
                    placeholder="HH:MM"
                    placeholderTextColor="#666"
                    className="bg-white dark:bg-gray-900 px-4 py-3 rounded-xl 
                      border border-gray-200 dark:border-gray-700 text-foreground dark:text-gray-100 ms-1"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Bus Details Card */}
          <View className="bg-blue-50/50 dark:bg-gray-800/50 rounded-2xl p-4 mb-4 border border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 items-center justify-center mr-2">
                <Ionicons name="bus-outline" size={24} color="#4ECDC4" />
              </View>
              <Text className="text-lg font-semibold text-foreground dark:text-white">
                Bus Details
              </Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium mb-1.5 text-foreground dark:text-dark-foreground">
                  Bus Number
                </Text>
                <TextInput
                  value={formData.busNumber}
                  onChangeText={(text) =>
                    setFormData({ ...formData, busNumber: text })
                  }
                  placeholder="Enter bus number"
                  placeholderTextColor="#666"
                  className="bg-white dark:bg-gray-900 px-4 py-3 rounded-xl 
                    border border-gray-200 dark:border-gray-700 text-foreground dark:text-gray-100 me-1"
                />
              </View>
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-1.5 text-foreground dark:text-dark-foreground">
                    Driver Name
                  </Text>
                  <TextInput
                    value={formData.driverName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, driverName: text })
                    }
                    placeholder="Enter driver name"
                    placeholderTextColor="#666"
                    className="bg-white dark:bg-gray-900 px-4 py-3 rounded-xl 
                      border border-gray-200 dark:border-gray-700 text-foreground dark:text-gray-100"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-1.5 text-foreground dark:text-dark-foreground">
                    Conductor Name
                  </Text>
                  <TextInput
                    value={formData.conductorName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, conductorName: text })
                    }
                    placeholder="Enter conductor name"
                    placeholderTextColor="#666"
                    className="bg-white dark:bg-gray-900 px-4 py-3 rounded-xl 
                      border border-gray-200 dark:border-gray-700 text-foreground dark:text-gray-100 ms-1"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Ticket Details Card */}
          <View className="bg-blue-50/50 dark:bg-gray-800/50 rounded-2xl p-4  border border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 items-center justify-center mr-2">
                <Ionicons name="ticket-outline" size={24} color="#4ECDC4" />
              </View>
              <Text className="text-lg font-semibold text-foreground dark:text-white">
                Ticket Details
              </Text>
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm font-medium mb-1.5 text-foreground dark:text-dark-foreground">
                  Ticket Price
                </Text>
                <TextInput
                  value={formData.price}
                  onChangeText={(text) =>
                    setFormData({ ...formData, price: text })
                  }
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#666"
                  className="bg-white dark:bg-gray-900 px-4 py-3 rounded-xl 
                    border border-gray-200 dark:border-gray-700 text-foreground dark:text-gray-100 me-1"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium mb-1.5 text-foreground dark:text-dark-foreground">
                  Total Seats
                </Text>
                <TextInput
                  value={formData.totalSeats}
                  onChangeText={(text) =>
                    setFormData({ ...formData, totalSeats: text })
                  }
                  keyboardType="number-pad"
                  placeholder="45"
                  placeholderTextColor="#666"
                  className="bg-white dark:bg-gray-900 px-4 py-3 rounded-xl 
                    border border-gray-200 dark:border-gray-700 text-foreground dark:text-gray-100 ms-1"
                />
              </View>
            </View>
          </View>
        </View>
        {/* Submit Button */}
        <View className="p-4  dark:border-gray-800 bg-white dark:bg-gray-900">
          <Pressable
            onPress={handleSubmit}
            className="bg-primary p-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-lg">
              Create Trip
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Location Selectors */}
      <LocationSelector
        visible={showFromModal}
        onClose={() => setShowFromModal(false)}
        onSelect={(location) => setFormData({ ...formData, from: location })}
        title="Select Departure City"
      />

      <LocationSelector
        visible={showToModal}
        onClose={() => setShowToModal(false)}
        onSelect={(location) => setFormData({ ...formData, to: location })}
        title="Select Arrival City"
      />
    </SafeAreaView>
  );
}
