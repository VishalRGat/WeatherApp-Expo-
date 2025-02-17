import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useWeatherStore } from '@/store/weatherStore';
import WeatherCard from '@/components/WeatherCard';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { weatherData, loading, error, fetchWeatherByCity, recentSearches } =
    useWeatherStore();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchWeatherByCity(searchQuery.trim());
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { color: colors.text, borderColor: colors.text }]}
          placeholder="Search city..."
          placeholderTextColor={colors.tabIconDefault}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {error && (
        <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text>
      )}

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

      {recentSearches.length > 0 && (
        <View style={styles.recentSearches}>
          <Text style={[styles.recentTitle, { color: colors.text }]}>
            Recent Searches
          </Text>
          {recentSearches.map((city, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.recentItem, { borderColor: colors.text }]}
              onPress={() => {
                setSearchQuery(city);
                fetchWeatherByCity(city);
              }}>
              <Text style={[styles.recentItemText, { color: colors.text }]}>
                {city}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  recentSearches: {
    padding: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  recentItemText: {
    fontSize: 16,
  },
});