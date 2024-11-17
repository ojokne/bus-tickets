import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, SafeAreaView, Pressable, StatusBar, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useState, useRef, useEffect } from 'react';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

// You'll need to get a Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyBpJ61taMG2mdBSlwjQ6PlOy-Zd4sMBJH8";

interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

interface Waypoint extends Location {
  estimatedArrival: string;
  distance: number;
  status: 'passed' | 'next' | 'upcoming';
}

interface Bus {
  id: string;
  busNumber: string;
  route: string;
  driver: {
    name: string;
    phone: string;
  };
  status: 'on-time' | 'delayed' | 'stopped';
  location: string;
  nextStop: string;
  estimatedArrival: string;
  routeDetails: {
    origin: Location;
    destination: Location;
    waypoints: Waypoint[];
    currentLocation: Location;
    progress: number;
  };
}

const DUMMY_BUSES: Bus[] = [
  {
    id: '1',
    busNumber: 'KBZ 123A',
    route: 'Nairobi → Mombasa',
    driver: {
      name: 'John Doe',
      phone: '+254712345678'
    },
    status: 'on-time',
    location: 'Mtito Andei',
    nextStop: 'Voi',
    estimatedArrival: '2:30 PM',
    routeDetails: {
      origin: {
        latitude: -1.2921,
        longitude: 36.8219,
        name: 'Nairobi'
      },
      destination: {
        latitude: -4.0435,
        longitude: 39.6682,
        name: 'Mombasa'
      },
      waypoints: [
        {
          latitude: -2.687247,
          longitude: 38.167206,
          name: 'Mtito Andei',
          estimatedArrival: '2:30 PM',
          distance: 234,
          status: 'passed'
        },
        {
          latitude: -3.3945,
          longitude: 38.5693,
          name: 'Voi',
          estimatedArrival: '4:00 PM',
          distance: 328,
          status: 'next'
        }
      ],
      currentLocation: {
        latitude: -2.687247,
        longitude: 38.167206,
        name: 'Mtito Andei'
      },
      progress: 50
    }
  },
  // ... other buses
];

const WaypointMarker = ({ waypoint, index }: { waypoint: Waypoint; index: number }) => (
  <Marker coordinate={waypoint}>
    <View className="items-center">
      <Ionicons 
        name="location-sharp" 
        size={24} 
        color={
          waypoint.status === 'passed' ? '#22c55e' : // green-500
          waypoint.status === 'next' ? '#000080' :   // primary
          '#9ca3af'                                  // gray-400
        } 
      />
      <View className="bg-white rounded-lg shadow-sm px-2 py-1 -mt-2">
        <Text className="text-[10px] font-medium text-gray-700">{waypoint.name}</Text>
      </View>
    </View>
  </Marker>
);

const WaypointsList = () => (
  <View className="mt-4">
    <Text className="text-lg font-semibold mb-2">Route Stops</Text>
    <View className="space-y-4">
      {DUMMY_BUSES[0].routeDetails.waypoints.map((waypoint, index) => (
        <View key={index} className="flex-row items-center">
          <View className={`w-2 h-2 rounded-full mr-3 ${
            waypoint.status === 'passed' ? 'bg-green-500' :
            waypoint.status === 'next' ? 'bg-primary' :
            'bg-gray-500'
          }`} />
          <View className="flex-1">
            <Text className="font-medium">{waypoint.name}</Text>
            <Text className="text-sm text-muted-foreground">
              {waypoint.estimatedArrival} • {waypoint.distance}km
            </Text>
          </View>
          {waypoint.status === 'next' && (
            <View className="bg-primary/10 px-2 py-1 rounded">
              <Text className="text-primary text-xs">Next Stop</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  </View>
);

const RouteProgress = () => (
  <View className="mt-4">
    <View className="h-2 bg-gray-100 rounded-full">
      <View 
        className="h-2 bg-primary rounded-full"
        style={{ width: `${DUMMY_BUSES[0].routeDetails.progress}%` }}
      />
    </View>
    <View className="flex-row justify-between mt-1">
      <Text className="text-xs text-muted-foreground">
        {DUMMY_BUSES[0].routeDetails.origin.name}
      </Text>
      <Text className="text-xs text-muted-foreground">
        {DUMMY_BUSES[0].routeDetails.destination.name}
      </Text>
    </View>
  </View>
);

export default function BusTrackingScreen() {
  const { id } = useLocalSearchParams();
  const bus = DUMMY_BUSES.find(b => b.id === id);
  const mapRef = useRef<MapView>(null);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const BOTTOM_SHEET_MIN_HEIGHT = 150;
  const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.55;
  const translateY = useSharedValue(BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const newTranslateY = startY.value + event.translationY;
      translateY.value = Math.max(
        0,
        Math.min(
          BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT,
          newTranslateY
        )
      );
    })
    .onEnd((event) => {
      const snapPoint = event.velocityY > 0 
        ? BOTTOM_SHEET_MAX_HEIGHT - BOTTOM_SHEET_MIN_HEIGHT
        : 0;
        
      translateY.value = withSpring(snapPoint, {
        velocity: event.velocityY,
        damping: 20,
        stiffness: 100,
      });
      
      runOnJS(setIsBottomSheetExpanded)(snapPoint === 0);
    });

  const bottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!bus) {
    return <Text>Bus not found</Text>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView className="flex-1 bg-background pt-8">
        <View className="border-b border-primary/5">
          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                className="p-2 rounded-full bg-primary/5 mr-3"
              >
                <Ionicons name="arrow-back" size={24} color="#000080" />
              </Pressable>
              <View>
                <Text className="text-lg font-bold text-foreground">
                  {bus.busNumber}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {bus.route}
                </Text>
              </View>
            </View>
            <View className={`px-3 py-1 rounded-full ${
              bus.status === 'on-time' ? 'bg-green-50 text-green-700' :
              bus.status === 'delayed' ? 'bg-yellow-50 text-yellow-700' :
              bus.status === 'stopped' ? 'bg-red-50 text-red-700' :
              'bg-gray-50 text-gray-700'
            }`}>
              <Text className="text-xs font-medium capitalize">
                {bus.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Map View */}
        <View className="flex-1" style={{ opacity: isBottomSheetExpanded ? 0.7 : 1 }}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{
              width: Dimensions.get('window').width,
              height: '100%',
            }}
            initialRegion={{
              latitude: bus.routeDetails.currentLocation.latitude,
              longitude: bus.routeDetails.currentLocation.longitude,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
          >
            {/* Origin Marker */}
            <Marker coordinate={bus.routeDetails.origin}>
              <View className="items-center">
                <Ionicons name="location-sharp" size={24} color="#22c55e" />
                <View className="bg-white rounded-lg shadow-sm px-2 py-1 -mt-2">
                  <Text className="text-[10px] font-medium text-gray-700">
                    {bus.routeDetails.origin.name}
                  </Text>
                </View>
              </View>
            </Marker>

            {/* Destination Marker */}
            <Marker coordinate={bus.routeDetails.destination}>
              <View className="items-center">
                <Ionicons name="location-sharp" size={24} color="#ef4444" />
                <View className="bg-white rounded-lg shadow-sm px-2 py-1 -mt-2">
                  <Text className="text-[10px] font-medium text-gray-700">
                    {bus.routeDetails.destination.name}
                  </Text>
                </View>
              </View>
            </Marker>

            {/* Waypoint Markers */}
            {bus.routeDetails.waypoints.map((waypoint, index) => (
              <WaypointMarker key={index} waypoint={waypoint} index={index} />
            ))}

            {/* Current Bus Location */}
            <Marker coordinate={bus.routeDetails.currentLocation}>
              <View className="items-center">
                <View className="bg-primary rounded-full p-1.5">
                  <Ionicons name="bus" size={16} color="#fff" />
                </View>
                <View className="bg-white rounded-lg shadow-sm px-2 py-1 mt-1">
                  <Text className="text-[10px] font-medium text-gray-700">Current Location</Text>
                </View>
              </View>
            </Marker>

            {/* Route Line */}
            <MapViewDirections
              origin={bus.routeDetails.origin}
              destination={bus.routeDetails.destination}
              waypoints={bus.routeDetails.waypoints}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={2}
              strokeColor="#000080"
              optimizeWaypoints={true}
              onReady={result => {
                // Fit the map to show all markers
                mapRef.current?.fitToCoordinates(
                  [
                    bus.routeDetails.origin,
                    ...bus.routeDetails.waypoints,
                    bus.routeDetails.destination
                  ],
                  {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                  }
                );
              }}
            />
          </MapView>

          {/* Map Controls */}
          <View className="absolute top-4 right-4 space-y-2">
            <Pressable 
              onPress={() => mapRef.current?.fitToCoordinates(
                [
                  bus.routeDetails.origin,
                  ...bus.routeDetails.waypoints,
                  bus.routeDetails.destination
                ],
                {
                  edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                  animated: true,
                }
              )}
              className="bg-white p-2 rounded-full shadow-md"
            >
              <Ionicons name="expand" size={24} color="#000080" />
            </Pressable>
            <Pressable 
              onPress={() => mapRef.current?.animateToRegion({
                ...bus.routeDetails.currentLocation,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              })}
              className="bg-white p-2 rounded-full shadow-md"
            >
              <Ionicons name="locate" size={24} color="#000080" />
            </Pressable>
          </View>
        </View>

        {/* Animated Bottom Sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: BOTTOM_SHEET_MAX_HEIGHT,
                backgroundColor: 'white',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: -2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              },
              bottomSheetStyle,
            ]}
          >
            {/* Drag Handle */}
            <View className="items-center pt-2 pb-4">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>

            {/* Scrollable Content */}
            <Animated.ScrollView
              className="flex-1"
              scrollEnabled={isBottomSheetExpanded}
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
            >
              {/* Minimized Content */}
              <View className="px-4">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-lg font-semibold text-foreground">
                      {bus.location}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Next: {bus.nextStop} • {bus.estimatedArrival}
                    </Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${
                    bus.status === 'on-time' ? 'bg-green-50 text-green-700' :
                    bus.status === 'delayed' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    <Text className="text-xs font-medium capitalize">{bus.status}</Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View className="mt-4">
                  <View className="h-2 bg-gray-100 rounded-full">
                    <View 
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${bus.routeDetails.progress}%` }}
                    />
                  </View>
                </View>
              </View>

              {/* Expanded Content */}
              <View className="px-4 mt-6">
                {/* Quick Stats */}
                <View className="flex-row justify-between mb-6 pt-2 border-t border-gray-100">
                  <View className="items-center flex-1">
                    <Text className="text-xs text-muted-foreground mb-1">Speed</Text>
                    <Text className="text-lg font-semibold text-foreground">80 km/h</Text>
                  </View>
                  <View className="items-center flex-1 border-x border-gray-200">
                    <Text className="text-xs text-muted-foreground mb-1">Distance</Text>
                    <Text className="text-lg font-semibold text-foreground">234 km</Text>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="text-xs text-muted-foreground mb-1">Time Left</Text>
                    <Text className="text-lg font-semibold text-foreground">2h 30m</Text>
                  </View>
                </View>

                {/* Driver Info */}
                <View className="flex-row items-center justify-between mb-6 bg-primary/5 p-3 rounded-xl">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-3">
                      <Ionicons name="person" size={24} color="#000080" />
                    </View>
                    <View>
                      <Text className="text-foreground font-medium">{bus.driver.name}</Text>
                      <Text className="text-sm text-muted-foreground">Driver</Text>
                    </View>
                  </View>
                  <View className="flex-row">
                    <Pressable 
                      onPress={() => {/* Handle call */}}
                      className="w-10 h-10 rounded-full bg-white items-center justify-center mr-2"
                    >
                      <Ionicons name="call-outline" size={20} color="#000080" />
                    </Pressable>
                    <Pressable 
                      onPress={() => {/* Handle message */}}
                      className="w-10 h-10 rounded-full bg-primary items-center justify-center"
                    >
                      <Ionicons name="chatbubble-outline" size={20} color="#fff" />
                    </Pressable>
                  </View>
                </View>

                {/* Stops List */}
                <View>
                  <Text className="text-lg font-semibold mb-4">Route Stops</Text>
                  <View className="space-y-4">
                    {bus.routeDetails.waypoints.map((waypoint, index) => (
                      <View key={index} className="flex-row items-center">
                        <View className={`w-3 h-3 rounded-full mr-3 ${
                          waypoint.status === 'passed' ? 'bg-green-500' :
                          waypoint.status === 'next' ? 'bg-primary' :
                          'bg-gray-300'
                        }`} />
                        <View className="flex-1">
                          <Text className="font-medium text-foreground">{waypoint.name}</Text>
                          <Text className="text-sm text-muted-foreground">
                            {waypoint.estimatedArrival} • {waypoint.distance}km
                          </Text>
                        </View>
                        {waypoint.status === 'next' && (
                          <View className="bg-primary/10 px-3 py-1 rounded-full">
                            <Text className="text-primary text-xs font-medium">Next Stop</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>

                {/* Bottom padding for better scrolling */}
                <View className="h-8" />
              </View>
            </Animated.ScrollView>
          </Animated.View>
        </GestureDetector>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
} 