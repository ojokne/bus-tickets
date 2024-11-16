import { View, Text, Modal, SafeAreaView, Pressable, TextInput, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import { Ionicons } from "@expo/vector-icons";

// This will come from your API/database later
const CONDUCTORS = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  // Add more conductors
];

interface ConductorSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (conductor: string) => void;
}

export function ConductorSelector({ visible, onClose, onSelect }: ConductorSelectorProps) {
  const [localSearch, setLocalSearch] = useState("");

  const filteredConductors = useMemo(
    () =>
      CONDUCTORS.filter((conductor) =>
        conductor.toLowerCase().includes(localSearch.toLowerCase())
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
                  Select Conductor
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
                  placeholder="Search conductor..."
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

            {/* Conductor List */}
            <ScrollView 
              className="flex-1 px-4" 
              keyboardShouldPersistTaps="handled"
            >
              {filteredConductors.length === 0 ? (
                <View className="py-8 items-center">
                  <Text className="text-muted-foreground">
                    No conductors found
                  </Text>
                </View>
              ) : (
                filteredConductors.map((conductor) => (
                  <Pressable
                    key={conductor}
                    onPress={() => {
                      onSelect(conductor);
                      setLocalSearch("");
                      onClose();
                    }}
                    className="py-4 border-b border-primary/5 flex-row justify-between items-center"
                  >
                    <View className="flex-row items-center">
                      <Ionicons 
                        name="person-outline" 
                        size={20} 
                        color="#5959A6" 
                        className="mr-2" 
                      />
                      <Text className="text-muted-foreground text-lg">
                        {conductor}
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