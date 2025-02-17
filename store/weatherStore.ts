import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const WEATHER_API_KEY = 'AVB6XFQK3QDYN3WTVB7AD4V4G';
const WEATHER_API_BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  cityName: string;
}

interface WeatherStore {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  recentSearches: string[];
  fetchWeatherByLocation: () => Promise<void>;
  fetchWeatherByCity: (city: string) => Promise<void>;
  addRecentSearch: (city: string) => void;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  weatherData: null,
  loading: false,
  error: null,
  recentSearches: [],

  fetchWeatherByLocation: async () => {
    set({ loading: true, error: null });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({});
      const response = await fetch(
        `${WEATHER_API_BASE_URL}/${location.coords.latitude},${location.coords.longitude}?unitGroup=metric&key=${WEATHER_API_KEY}&contentType=json`
      );
      
      if (!response.ok) throw new Error('Failed to fetch weather data');
      
      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: Math.round(data.currentConditions.temp),
        feelsLike: Math.round(data.currentConditions.feelslike),
        humidity: data.currentConditions.humidity,
        windSpeed: data.currentConditions.windspeed,
        condition: data.currentConditions.conditions,
        icon: data.currentConditions.icon,
        cityName: data.address,
      };
      
      set({ weatherData });
      await AsyncStorage.setItem('lastWeather', JSON.stringify(weatherData));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
      const cachedData = await AsyncStorage.getItem('lastWeather');
      if (cachedData) {
        set({ weatherData: JSON.parse(cachedData) });
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchWeatherByCity: async (city: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${WEATHER_API_BASE_URL}/${encodeURIComponent(city)}?unitGroup=metric&key=${WEATHER_API_KEY}&contentType=json`
      );
      
      if (!response.ok) throw new Error('City not found');
      
      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: Math.round(data.currentConditions.temp),
        feelsLike: Math.round(data.currentConditions.feelslike),
        humidity: data.currentConditions.humidity,
        windSpeed: data.currentConditions.windspeed,
        condition: data.currentConditions.conditions,
        icon: data.currentConditions.icon,
        cityName: data.address,
      };
      
      set({ weatherData });
      get().addRecentSearch(city);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },

  addRecentSearch: async (city: string) => {
    const { recentSearches } = get();
    const updatedSearches = [
      city,
      ...recentSearches.filter(s => s !== city),
    ].slice(0, 5);
    set({ recentSearches: updatedSearches });
    await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  },
}));