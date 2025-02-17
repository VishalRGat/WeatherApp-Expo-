import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  useColorScheme,
  Platform,
} from 'react-native';
import { useWeatherStore } from '@/store/weatherStore';
import Colors from '@/constants/Colors';
import { Appearance } from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = React.useState(true);

  const toggleAutoRefresh = () => {
    setIsAutoRefreshEnabled(previous => !previous);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.section, { borderColor: colors.text }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          App Settings
        </Text>
        
        <View style={styles.setting}>
          <Text style={[styles.settingText, { color: colors.text }]}>
            Auto-refresh Weather
          </Text>
          <Switch
            value={isAutoRefreshEnabled}
            onValueChange={toggleAutoRefresh}
            trackColor={{ false: '#767577', true: colors.tint }}
          />
        </View>

        <View style={styles.setting}>
          <Text style={[styles.settingText, { color: colors.text }]}>
            Theme
          </Text>
          <Text style={[styles.settingValue, { color: colors.text }]}>
            {colorScheme === 'dark' ? 'Dark' : 'Light'} (System)
          </Text>
        </View>
      </View>

      <View style={[styles.section, { borderColor: colors.text }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          About
        </Text>
        <Text style={[styles.aboutText, { color: colors.text }]}>
          Weather App v1.0.0
        </Text>
        <Text style={[styles.aboutText, { color: colors.text }]}>
          Built with Expo By Vishal Gat
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    opacity: 0.7,
  },
  aboutText: {
    fontSize: 16,
    marginBottom: 8,
  },
});