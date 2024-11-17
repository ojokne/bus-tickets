import { View, Text, SafeAreaView, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

interface Seat {
  id: string;
  number: string;
  status: 'available' | 'selected' | 'booked';
  price: number;
  position?: 'window' | 'aisle' | 'middle';
}

interface BusLayoutProps {
  seats: Seat[];
  onSeatPress: (seat: Seat) => void;
  selectedSeat: Seat | null;
}

// First, let's organize seats in a more realistic way
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  
  // Driver's side single seat
  seats.push({
    id: 'DS',
    number: 'DS',
    status: Math.random() > 0.3 ? 'available' : 'booked',
    price: 1200,
    position: 'aisle'
  });

  // Main rows (12 rows of 5 seats each = 60 seats)
  for (let row = 1; row <= 12; row++) {
    // Left side (2 seats: A, B)
    ['A', 'B'].forEach(col => {
      seats.push({
        id: `${row}${col}`,
        number: `${row}${col}`,
        status: Math.random() > 0.3 ? 'available' : 'booked',
        price: 1200,
        position: col === 'A' ? 'window' : 'aisle'
      });
    });

    // Right side (3 seats: C, D, E)
    ['C', 'D', 'E'].forEach(col => {
      seats.push({
        id: `${row}${col}`,
        number: `${row}${col}`,
        status: Math.random() > 0.3 ? 'available' : 'booked',
        price: 1200,
        position: col === 'C' ? 'aisle' : col === 'D' ? 'middle' : 'window'
      });
    });
  }

  // Last row (6 seats: A, B, M, C, D, E)
  ['A', 'B', 'M', 'C', 'D', 'E'].forEach(col => {
    seats.push({
      id: `13${col}`,
      number: `13${col}`,
      status: Math.random() > 0.3 ? 'available' : 'booked',
      price: 1200,
      position: col === 'M' ? 'middle' : 'window'
    });
  });

  return seats;
};

// Update the bus layout component
const BusLayout: React.FC<BusLayoutProps> = ({ seats, onSeatPress, selectedSeat }) => {
  // Helper function to get seat status classes
  const getSeatClasses = (seat: Seat | undefined) => ({
    container: `w-9 h-9 mx-0.5 rounded-lg justify-center items-center ${
      seat?.status === 'booked' ? 'bg-gray-100' :
      seat?.status === 'selected' ? 'bg-primary' :
      'bg-primary/10'
    }`,
    text: `text-xs font-medium ${
      seat?.status === 'selected' ? 'text-white' :
      seat?.status === 'booked' ? 'text-gray-400' :
      'text-primary'
    }`
  });

  return (
    <View className="bg-white rounded-lg p-4">
      {/* Bus Front */}
      <View className="flex-row items-center justify-between mb-8">
        <View className="flex-1 h-16 border-2 border-gray-200 rounded-t-xl">
          <View className="absolute -top-2 left-4">
            <View className="w-9 h-9 justify-center items-center">
              <Ionicons name="person" size={20} color="#666" />
              <Text className="text-[10px] text-gray-500">Driver</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Seats Layout */}
      <View className="flex-row">
        {/* Row Numbers */}
        <View className="w-6 justify-between py-1">
          {[...Array(13)].map((_, index) => (
            <View key={`row-${index + 1}`} className="h-9 justify-center">
              <Text className="text-xs text-gray-400">{index + 1}</Text>
            </View>
          ))}
        </View>

        {/* Left Side Seats */}
        <View className="flex-1">
          {[...Array(12)].map((_, row) => (
            <View key={`left-${row}`} className="flex-row justify-end mb-2">
              {['A', 'B'].map((col) => {
                const seatId = `${row + 1}${col}`;
                const seat = seats.find(s => s.number === seatId);
                const classes = getSeatClasses(seat);
                return (
                  <Pressable
                    key={seatId}
                    onPress={() => seat && onSeatPress(seat)}
                    className={classes.container}
                  >
                    <Text className={classes.text}>{seatId}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        {/* Aisle */}
        <View className="w-6 mx-1">
          <View className="h-[92%] border-l border-r border-dashed border-gray-300" />
          {/* Last row middle seat */}
          {seats.find(s => s.number === '13M') && (
            <Pressable
              onPress={() => onSeatPress(seats.find(s => s.number === '13M')!)}
              className={getSeatClasses(seats.find(s => s.number === '13M')).container}
            >
              <Text className={getSeatClasses(seats.find(s => s.number === '13M')).text}>
                13M
              </Text>
            </Pressable>
          )}
        </View>

        {/* Right Side Seats */}
        <View className="flex-1">
          {[...Array(12)].map((_, row) => (
            <View key={`right-${row}`} className="flex-row mb-2">
              {['C', 'D', 'E'].map((col) => {
                const seatId = `${row + 1}${col}`;
                const seat = seats.find(s => s.number === seatId);
                const classes = getSeatClasses(seat);
                return (
                  <Pressable
                    key={seatId}
                    onPress={() => seat && onSeatPress(seat)}
                    className={classes.container}
                  >
                    <Text className={classes.text}>{seatId}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Last Row */}
      <View className="flex-row justify-center mt-2">
        {['A', 'B', 'M', 'C', 'D', 'E'].map((col) => {
          const seatId = `13${col}`;
          const seat = seats.find(s => s.number === seatId);
          const classes = getSeatClasses(seat);
          return (
            <Pressable
              key={seatId}
              onPress={() => seat && onSeatPress(seat)}
              className={classes.container}
            >
              <Text className={classes.text}>{seatId}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Legend */}
      <View className="flex-row justify-center mt-8 space-x-4">
        <View className="flex-row items-center">
          <View className="w-4 h-4 rounded bg-primary/10 mr-2" />
          <Text className="text-xs text-muted-foreground">Available</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 rounded bg-primary mr-2" />
          <Text className="text-xs text-muted-foreground">Selected</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 rounded bg-gray-100 mr-2" />
          <Text className="text-xs text-muted-foreground">Booked</Text>
        </View>
      </View>
    </View>
  );
};

export default function SeatSelectionScreen() {
  const { id } = useLocalSearchParams();
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  const handleSeatPress = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    if (selectedSeat?.id === seat.id) {
      setSelectedSeat(null);
      setSeats(seats.map(s => 
        s.id === seat.id ? { ...s, status: 'available' } : s
      ));
      return;
    }

    setSelectedSeat(seat);
    setSeats(seats.map(s => 
      s.id === seat.id ? { ...s, status: 'selected' } :
      s.status === 'selected' ? { ...s, status: 'available' } : s
    ));
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="p-4 border-b border-border">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text className="ml-2 text-lg font-semibold">Select Seat</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 p-4">
        <BusLayout 
          seats={seats}
          onSeatPress={handleSeatPress}
          selectedSeat={selectedSeat}
        />
      </ScrollView>

      {/* Bottom Action */}
      {selectedSeat && (
        <View className="p-4 border-t border-border bg-white">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-muted-foreground">Selected Seat</Text>
            <Text className="text-lg font-semibold">#{selectedSeat.number}</Text>
          </View>
          <Pressable
            onPress={() => router.push(`/sell-tickets/${id}/details`)}
            className="bg-primary p-4 rounded-lg items-center"
          >
            <Text className="text-white font-medium">Continue to Details</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
} 