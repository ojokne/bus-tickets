import { View, Text, Modal, SafeAreaView, Pressable, TextInput, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import { Ionicons } from "@expo/vector-icons";

// This will come from your API/database later
const BUSES = [
  "KBZ 123A",
  "KCY 456B",
  "KDX 789C",
  // Add more bus numbers
];

interface BusSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (bus: string) => void;
}

export function BusSelector({ visible, onClose, onSelect }: BusSelectorProps) {
  const [localSearch, setLocalSearch] = useState("");

  const filteredBuses = useMemo(
    () =>
      BUSES.filter((bus) =>
        bus.toLowerCase().includes(localSearch.toLowerCase())
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
      <View className="flex-1 bg-white">
        <SafeAreaView className="flex-1">
          <View className="flex-1">
            {/* Header */}
            <View className="pt-10 px-4 pb-4 border-b border-primary/5">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-lg font-semibold text-center text-foreground flex-1">
                  Select Bus
                </Text>
                <Pressable
                  onPress={() => {
                    setLocalSearch("");
                    onClose();
                  }}
                  className="p-2 rounded-full bg-primary/5"
                >
                  <Ionicons name="close" size={20} color="#000080" />
                </Pressable>
              </View>

              {/* Search Bar */}
              <View className="border border-primary/5 rounded-xl flex-row items-center px-4">
                <Ionicons name="search" size={20} color="#5959A6" />
                <TextInput
                  placeholder="Search bus number..."
                  placeholderTextColor="#5959A6"
                  className="flex-1 py-3 px-2 text-muted-foreground"
                  value={localSearch}
                  onChangeText={setLocalSearch}
                  autoFocus
                  cursorColor="#000080"
                />
                {localSearch.length > 0 && (
                  <Pressable onPress={() => setLocalSearch("")}>
                    <Ionicons name="close-circle" size={20} color="#5959A6" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Bus List */}
            <ScrollView 
              className="flex-1 px-4" 
              keyboardShouldPersistTaps="handled"
            >
              {filteredBuses.length === 0 ? (
                <View className="py-8 items-center">
                  <Text className="text-muted-foreground">No buses found</Text>
                </View>
              ) : (
                filteredBuses.map((bus) => (
                  <Pressable
                    key={bus}
                    onPress={() => {
                      onSelect(bus);
                      setLocalSearch("");
                      onClose();
                    }}
                    className="py-4 border-b border-primary/5 flex-row justify-between items-center"
                  >
                    <View className="flex-row items-center">
                      <Ionicons 
                        name="bus-outline" 
                        size={20} 
                        color="#5959A6" 
                        className="mr-2" 
                      />
                      <Text className="text-muted-foreground text-lg">
                        {bus}
                      </Text>
                    </View>
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color="#5959A6" 
                    />
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
} 