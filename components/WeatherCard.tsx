import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Animated, { FadeIn } from 'react-native-reanimated';

const getWeatherGradient = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return ['#4DA0B0', '#D39D38'];
    case 'clouds':
      return ['#757F9A', '#D7DDE8'];
    case 'rain':
      return ['#000046', '#1CB5E0'];
    default:
      return ['#2C3E50', '#3498DB'];
  }
};

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'sunny';
    case 'clouds':
      return 'cloudy';
    case 'rain':
      return 'rainy';
    default:
      return 'partly-sunny';
  }
};

interface WeatherCardProps {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  cityName: string;
}

export default function WeatherCard({
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  condition,
  cityName,
}: WeatherCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <LinearGradient
        colors={getWeatherGradient(condition)}
        style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.city}>{cityName}</Text>
          <Ionicons
            name={getWeatherIcon(condition)}
            size={80}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.temperature}>{temperature}°C</Text>
          <Text style={styles.condition}>{condition}</Text>
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="thermometer" size={24} color="#fff" />
              <Text style={styles.detailText}>Feels like: {feelsLike}°C</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="water" size={24} color="#fff" />
              <Text style={styles.detailText}>Humidity: {humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer" size={24} color="#fff" />
              <Text style={styles.detailText}>Wind: {windSpeed} m/s</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  icon: {
    marginVertical: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  condition: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  details: {
    width: '100%',
    marginTop: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
});