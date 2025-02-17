import React, { useEffect } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { useWeatherStore } from '@/store/weatherStore';
import WeatherCard from '@/components/WeatherCard';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorMessage from '@/components/ErrorMessage';

export default function WeatherScreen() {
  const { weatherData, loading, error, fetchWeatherByLocation } = useWeatherStore();

  useEffect(() => {
    fetchWeatherByLocation();
    const interval = setInterval(fetchWeatherByLocation, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading && !weatherData) {
    return <LoadingScreen />;
  }

  if (error && !weatherData) {
    return <ErrorMessage message={error} onRetry={fetchWeatherByLocation} />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchWeatherByLocation} />
      }>
      {weatherData && (
        <WeatherCard
          temperature={weatherData.temperature}
          feelsLike={weatherData.feelsLike}
          humidity={weatherData.humidity}
          windSpeed={weatherData.windSpeed}
          condition={weatherData.condition}
          cityName={weatherData.cityName}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
});