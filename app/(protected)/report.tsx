import { View, Text, SafeAreaView, ScrollView, Pressable, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

interface ReportData {
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
  operations: {
    activeFleet: number;
    totalFleet: number;
    maintenanceCount: number;
    averageTripDuration: string;
    onTimePerformance: number;
  };
  occupancy: {
    averageRate: number;
    peakHours: Array<{
      time: string;
      rate: number;
    }>;
    lowPerformingRoutes: Array<{
      route: string;
      rate: number;
    }>;
  };
  routes: {
    mostProfitable: Array<{
      route: string;
      revenue: number;
      occupancyRate: number;
    }>;
    highDemand: Array<{
      route: string;
      bookingRate: number;
      averageWaitlist: number;
    }>;
  };
  customerMetrics: {
    satisfaction: number;
    complaints: number;
    resolvedComplaints: number;
    repeatCustomers: number;
  };
  fuelMetrics: {
    totalConsumption: number;
    costPerKm: number;
    efficiency: number;
  };
  staffPerformance: {
    topDrivers: Array<{
      name: string;
      rating: number;
      trips: number;
    }>;
    attendance: number;
    incidentReports: number;
  };
}

const DUMMY_DATA: ReportData = {
  revenue: {
    today: 145000,
    thisWeek: 980000,
    thisMonth: 4250000,
    growth: 12.5
  },
  operations: {
    activeFleet: 42,
    totalFleet: 50,
    maintenanceCount: 3,
    averageTripDuration: "3h 45m",
    onTimePerformance: 92
  },
  occupancy: {
    averageRate: 85,
    peakHours: [
      { time: "6:00 AM - 9:00 AM", rate: 95 },
      { time: "5:00 PM - 8:00 PM", rate: 92 }
    ],
    lowPerformingRoutes: [
      { route: "Nairobi → Nakuru", rate: 65 },
      { route: "Mombasa → Malindi", rate: 70 }
    ]
  },
  routes: {
    mostProfitable: [
      { route: "Nairobi → Mombasa", revenue: 180000, occupancyRate: 95 },
      { route: "Nairobi → Kisumu", revenue: 120000, occupancyRate: 88 }
    ],
    highDemand: [
      { route: "Nairobi → Mombasa", bookingRate: 98, averageWaitlist: 15 },
      { route: "Nairobi → Kisumu", bookingRate: 95, averageWaitlist: 12 }
    ]
  },
  customerMetrics: {
    satisfaction: 4.5,
    complaints: 8,
    resolvedComplaints: 7,
    repeatCustomers: 75
  },
  fuelMetrics: {
    totalConsumption: 2500, // liters
    costPerKm: 45, // KES
    efficiency: 85 // percentage
  },
  staffPerformance: {
    topDrivers: [
      { name: "John Doe", rating: 4.9, trips: 45 },
      { name: "Jane Smith", rating: 4.8, trips: 42 }
    ],
    attendance: 95,
    incidentReports: 2
  }
};

export default function ReportsScreen() {
  const data = DUMMY_DATA;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View className="bg-white border-b border-primary/5">
        <View className="p-4">
          <Text className="text-2xl font-bold text-foreground">Operations Report</Text>
          <Text className="text-sm text-muted-foreground">Daily performance overview</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 space-y-6">
          {/* Revenue Overview */}
          <View className="bg-primary p-6 rounded-2xl">
            <Text className="text-white text-lg font-semibold mb-4">Revenue Overview</Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-white/60 text-sm">Today</Text>
                <Text className="text-white text-xl font-bold">
                  KES {data.revenue.today.toLocaleString()}
                </Text>
              </View>
              <View>
                <Text className="text-white/60 text-sm">This Week</Text>
                <Text className="text-white text-xl font-bold">
                  KES {data.revenue.thisWeek.toLocaleString()}
                </Text>
              </View>
              <View>
                <Text className="text-white/60 text-sm">Growth</Text>
                <Text className="text-white text-xl font-bold">+{data.revenue.growth}%</Text>
              </View>
            </View>
          </View>

          {/* Fleet Status */}
          <View className="bg-white p-4 rounded-xl border border-primary/5">
            <Text className="text-lg font-semibold text-foreground mb-3">Fleet Status</Text>
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Active Buses</Text>
                <Text className="text-foreground font-medium">
                  {data.operations.activeFleet}/{data.operations.totalFleet}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Under Maintenance</Text>
                <Text className="text-yellow-600 font-medium">{data.operations.maintenanceCount}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">On-Time Performance</Text>
                <Text className="text-green-600 font-medium">{data.operations.onTimePerformance}%</Text>
              </View>
            </View>
          </View>

          {/* High Demand Routes */}
          <View className="bg-white p-4 rounded-xl border border-primary/5">
            <Text className="text-lg font-semibold text-foreground mb-3">High Demand Routes</Text>
            {data.routes.highDemand.map((route, index) => (
              <View 
                key={index}
                className="flex-row justify-between items-center py-3 border-b border-primary/5"
              >
                <View>
                  <Text className="text-foreground font-medium">{route.route}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {route.bookingRate}% booked
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-foreground font-medium">
                    {route.averageWaitlist} waitlist
                  </Text>
                  <Text className="text-xs text-primary">Add bus →</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Customer Satisfaction */}
          <View className="bg-white p-4 rounded-xl border border-primary/5">
            <Text className="text-lg font-semibold text-foreground mb-3">Customer Metrics</Text>
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Satisfaction Rate</Text>
                <Text className="text-green-600 font-medium">★ {data.customerMetrics.satisfaction}/5.0</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Complaints (Resolved)</Text>
                <Text className="text-foreground font-medium">
                  {data.customerMetrics.resolvedComplaints}/{data.customerMetrics.complaints}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Repeat Customers</Text>
                <Text className="text-green-600 font-medium">{data.customerMetrics.repeatCustomers}%</Text>
              </View>
            </View>
          </View>

          {/* Fuel Efficiency */}
          <View className="bg-white p-4 rounded-xl border border-primary/5">
            <Text className="text-lg font-semibold text-foreground mb-3">Fuel Metrics</Text>
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Total Consumption</Text>
                <Text className="text-foreground font-medium">{data.fuelMetrics.totalConsumption}L</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Cost per KM</Text>
                <Text className="text-foreground font-medium">KES {data.fuelMetrics.costPerKm}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-muted-foreground">Efficiency Rating</Text>
                <Text className="text-green-600 font-medium">{data.fuelMetrics.efficiency}%</Text>
              </View>
            </View>
          </View>

          {/* Top Performing Staff */}
          <View className="bg-white p-4 rounded-xl border border-primary/5">
            <Text className="text-lg font-semibold text-foreground mb-3">Top Drivers</Text>
            {data.staffPerformance.topDrivers.map((driver, index) => (
              <View 
                key={index}
                className="flex-row justify-between items-center py-3 border-b border-primary/5"
              >
                <View>
                  <Text className="text-foreground font-medium">{driver.name}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {driver.trips} trips completed
                  </Text>
                </View>
                <Text className="text-green-600 font-medium">★ {driver.rating}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 