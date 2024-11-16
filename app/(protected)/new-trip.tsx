import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  TextInput,
  Modal,
  StatusBar,
  Platform,
} from "react-native";
import { useState, useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { LocationSelector } from "@/components/new-trip/LocationSelector";
import { BusSelector } from "@/components/new-trip/BusSelector";
import { ConductorSelector } from "@/components/new-trip/ConductorSelector";
import { DriverSelector } from "@/components/new-trip/DriverSelector";

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

export default function NewTripScreen() {
  const params = useLocalSearchParams();
  const isEditMode = params.editMode === 'true';

  const [formData, setFormData] = useState<TripFormData>({
    from: params.from?.toString() || "",
    to: params.to?.toString() || "",
    date: params.date?.toString() || "",
    time: params.time?.toString() || "",
    busNumber: params.busNumber?.toString() || "",
    price: params.price?.toString() || "",
    totalSeats: params.totalSeats?.toString() || "45",
    driverName: params.driverName?.toString() || "",
    conductorName: params.conductorName?.toString() || ""
  });

  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showBusModal, setShowBusModal] = useState(false);
  const [showConductorModal, setShowConductorModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        console.log("Updating trip:", formData);
        // Add your update API call here
      } else {
        console.log("Creating new trip:", formData);
        // Add your create API call here
      }
      router.back();
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
      setFormData({ ...formData, date: formattedDate });
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedTime(time);
      const formattedTime = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setFormData({ ...formData, time: formattedTime });
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView className="flex-1 bg-background pt-8">
        {/* Header */}
        <View className="border-b border-primary/5">
          <View className="flex-row items-center p-4">
            <Pressable
              onPress={() => router.back()}
              className="mr-4 p-2 rounded-full bg-primary/5"
            >
              <Ionicons name="arrow-back" size={24} color="#000080" />
            </Pressable>
            <View>
              <Text className="text-2xl font-bold text-foreground">
                {isEditMode ? "Edit Trip" : "Create New Trip"}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {isEditMode ? "Update trip details below" : "Fill in the trip details below"}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1">
          <View className="p-4 space-y-6">
            {/* Route Information Card */}
            <View className="rounded-2xl p-4 mb-4 border border-primary/5">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-primary/5 items-center justify-center mr-2">
                  <Ionicons name="map-outline" size={24} color="#000080" />
                </View>
                <Text className="text-lg font-semibold text-foreground">
                  Route Information
                </Text>
              </View>

              <View className="space-y-4">
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-medium mb-1.5 mt-1.5 text-foreground">
                      From
                    </Text>
                    <Pressable
                      onPress={() => setShowFromModal(true)}
                      className="bg-white  px-4 py-3 me-1 rounded-xl 
                        border border-primary/5 flex-row justify-between items-center"
                    >
                      <Text
                        className={`${
                          formData.from
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formData.from || "From"}
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        size={20}
                        color="#5959A6"
                      />
                    </Pressable>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium mb-1.5 mt-1.5 text-foreground">
                      To
                    </Text>
                    <Pressable
                      onPress={() => setShowToModal(true)}
                      className="bg-white px-4 py-3 ms-1 rounded-xl border border-primary/5 flex-row justify-between items-center"
                    >
                      <Text
                        className={`${
                          formData.to ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {formData.to || "Select Destination"}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#5959A6" />
                    </Pressable>
                  </View>
                </View>

                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-medium mb-1.5 mt-1.5 text-foreground">
                      Date
                    </Text>
                    <Pressable
                      onPress={() => setShowDatePicker(true)}
                      className="bg-white px-4 py-3 rounded-xl border border-primary/5 flex-row justify-between items-center me-1"
                    >
                      <Text className={formData.date ? "text-foreground" : "text-muted-foreground"}>
                        {formData.date || "DD/MM/YYYY"}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color="#5959A6" />
                    </Pressable>

                    {/* Date Picker */}
                    {showDatePicker && (
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                        minimumDate={new Date()} // Only allow future date
                        style={Platform.OS === 'ios' ? { 
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: 'white'
                        } : undefined}
                      />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium mb-1.5 mt-1.5 text-foreground">
                      Time
                    </Text>
                    <Pressable
                      onPress={() => setShowTimePicker(true)}
                      className="bg-white px-4 py-3 rounded-xl border border-primary/5 flex-row justify-between items-center ms-1"
                    >
                      <Text className={formData.time ? "text-foreground" : "text-muted-foreground"}>
                        {formData.time || "Select Time"}
                      </Text>
                      <Ionicons name="time-outline" size={20} color="#5959A6" />
                    </Pressable>

                    {/* Time Picker */}
                    {showTimePicker && (
                      <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        is24Hour={false}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleTimeChange}
                        accentColor="#000080"
                        textColor="#000000"
                        style={Platform.OS === 'ios' ? { 
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: 'white'
                        } : undefined}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Bus Details Card */}
            <View className="rounded-2xl p-4 mb-4 border border-primary/5">
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
                  <Text className="text-sm font-medium mb-1.5 mt-1.5 text-foreground">
                    Bus Number
                  </Text>
                  <Pressable
                    onPress={() => setShowBusModal(true)}
                    className="bg-white px-4 py-3 rounded-xl border border-primary/5 flex-row justify-between items-center"
                  >
                    <Text className={formData.busNumber ? "text-foreground" : "text-muted-foreground"}>
                      {formData.busNumber || "Select Bus Number"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#5959A6" />
                  </Pressable>
                </View>
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-medium mb-1.5 mt-1.5 text-foreground">
                      Driver
                    </Text>
                    <Pressable
                      onPress={() => setShowDriverModal(true)}
                      className="bg-white px-4 py-3 rounded-xl border border-primary/5 flex-row justify-between items-center me-1"
                    >
                      <Text className={formData.driverName ? "text-foreground" : "text-muted-foreground"}>
                        {formData.driverName || "Select Driver"}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#5959A6" />
                    </Pressable>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium mb-1.5 mt-1.5 text-foreground">
                      Conductor
                    </Text>
                    <Pressable
                      onPress={() => setShowConductorModal(true)}
                      className="bg-white px-4 py-3 rounded-xl border border-primary/5 flex-row justify-between items-center ms-1"
                    >
                      <Text className={formData.conductorName ? "text-foreground" : "text-muted-foreground"}>
                        {formData.conductorName || "Select Conductor"}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#5959A6" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            {/* Ticket Details Card */}
            <View className="rounded-2xl p-4 border border-primary/5">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-primary/5 items-center justify-center mr-2">
                  <Ionicons name="ticket-outline" size={24} color="#000080" />
                </View>
                <Text className="text-lg font-semibold text-foreground">
                  Ticket Details
                </Text>
              </View>

              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-1.5 mt-1.5 text-foreground">
                    Ticket Price
                  </Text>
                  <TextInput
                    value={formData.price}
                    onChangeText={(text) =>
                      setFormData({ ...formData, price: text })
                    }
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor="#5959A6"
                    className="bg-white px-4 py-3 rounded-xl border border-primary/5 text-foreground me-1"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium mb-1.5 mt-1.5 text-foreground">
                    Total Seats
                  </Text>
                  <TextInput
                    value={formData.totalSeats}
                    onChangeText={(text) =>
                      setFormData({ ...formData, totalSeats: text })
                    }
                    keyboardType="number-pad"
                    placeholder="45"
                    placeholderTextColor="#5959A6"
                    className="bg-white px-4 py-3 rounded-xl border border-primary/5 text-foreground ms-1"
                  />
                </View>
              </View>
            </View>
          </View>
          {/* Submit Button */}
          <View className="p-4 bg-white">
            <Pressable
              onPress={handleSubmit}
              className="bg-primary p-4 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-lg">
                {isEditMode ? "Update Trip" : "Create Trip"}
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

        <BusSelector
          visible={showBusModal}
          onClose={() => setShowBusModal(false)}
          onSelect={(bus) => setFormData({ ...formData, busNumber: bus })}
        />

        <ConductorSelector
          visible={showConductorModal}
          onClose={() => setShowConductorModal(false)}
          onSelect={(conductor) => setFormData({ ...formData, conductorName: conductor })}
        />

        <DriverSelector
          visible={showDriverModal}
          onClose={() => setShowDriverModal(false)}
          onSelect={(driver) => setFormData({ ...formData, driverName: driver })}
        />
      </SafeAreaView>
    </>
  );
}
