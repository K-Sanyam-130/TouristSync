// screens/WeatherScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FAKE_CITIES = {
  'Mumbai': {
    current: { temp: 32, feels: 35, condition: 'sunny', humidity: 65 },
    forecast: [
      { day: 'Today', temp: 32, icon: 'sunny' },
      { day: 'Tomorrow', temp: 30, icon: 'partly-cloudy' },
      { day: 'Wed', temp: 29, icon: 'cloudy' },
      { day: 'Thu', temp: 31, icon: 'sunny' },
      { day: 'Fri', temp: 33, icon: 'thunderstorm' },
    ],
  },
  'Delhi': {
    current: { temp: 28, feels: 31, condition: 'hazy', humidity: 72 },
    forecast: [
      { day: 'Today', temp: 28, icon: 'hazy' },
      { day: 'Tomorrow', temp: 27, icon: 'rain' },
      { day: 'Wed', temp: 30, icon: 'sunny' },
      { day: 'Thu', temp: 29, icon: 'partly-cloudy' },
      { day: 'Fri', temp: 32, icon: 'sunny' },
    ],
  },
  'Bangalore': {
    current: { temp: 26, feels: 28, condition: 'cloudy', humidity: 58 },
    forecast: [
      { day: 'Today', temp: 26, icon: 'cloudy' },
      { day: 'Tomorrow', temp: 25, icon: 'rain' },
      { day: 'Wed', temp: 27, icon: 'partly-cloudy' },
      { day: 'Thu', temp: 28, icon: 'sunny' },
      { day: 'Fri', temp: 26, icon: 'cloudy' },
    ],
  },
};

const WEATHER_ICONS = {
  sunny: 'sunny',
  'partly-cloudy': 'partly-sunny',
  cloudy: 'cloudy',
  rain: 'rainy',
  thunderstorm: 'thunderstorm',
  hazy: 'warnings',
};

function WeatherCard({ day, temp, icon }) {
  return (
    <View style={styles.weatherCard}>
      <Text style={styles.dayText}>{day}</Text>
      <Ionicons 
        name={WEATHER_ICONS[icon] || 'cloud'} 
        size={28} 
        color="#ff7a45" 
      />
      <Text style={styles.tempText}>{temp}°</Text>
    </View>
  );
}

export default function WeatherScreen() {
  const [city, setCity] = useState('Mumbai');
  const [weatherData, setWeatherData] = useState(FAKE_CITIES.Mumbai);

  const handleCityChange = (text) => {
    setCity(text);
    if (FAKE_CITIES[text]) {
      setWeatherData(FAKE_CITIES[text]);
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: 'sunny',
      hazy: 'warnings',
      cloudy: 'cloudy',
      rain: 'rainy',
    };
    return icons[condition] || 'cloud';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Weather Forecast</Text>
        <Text style={styles.subtitle}>Get 5-day weather for any city</Text>

        {/* City search */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            style={styles.cityInput}
            placeholder="Enter city (Mumbai, Delhi...)"
            placeholderTextColor="#777"
            value={city}
            onChangeText={handleCityChange}
          />
        </View>
      </View>

      {/* Current weather */}
      <View style={styles.currentWeather}>
        <View style={styles.currentHeader}>
          <Ionicons 
            name={getWeatherIcon(weatherData.current.condition)} 
            size={64} 
            color="#ff7a45" 
          />
          <View style={styles.currentTemps}>
            <Text style={styles.currentTemp}>{weatherData.current.temp}°</Text>
            <Text style={styles.feelsLike}>
              Feels like {weatherData.current.feels}°
            </Text>
          </View>
        </View>
        <Text style={styles.conditionText}>
          {weatherData.current.condition.toUpperCase()}
        </Text>
        <Text style={styles.humidity}>
          Humidity: {weatherData.current.humidity}%
        </Text>
      </View>

      {/* 5-day forecast */}
      <View style={styles.forecastSection}>
        <Text style={styles.sectionTitle}>5-Day Forecast</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.forecastScroll}
        >
          {weatherData.forecast.map((item, index) => (
            <WeatherCard
              key={index}
              day={item.day}
              temp={item.temp}
              icon={item.icon}
            />
          ))}
        </ScrollView>
      </View>

      {/* Hourly forecast cards */}
      <View style={styles.hourlySection}>
        <Text style={styles.sectionTitle}>Today Hourly</Text>
        <View style={styles.hourlyRow}>
          {[22, 23, 0, 1, 2, 3].map((hour) => (
            <View key={hour} style={styles.hourlyCard}>
              <Text style={styles.hourText}>
                {hour}:00
              </Text>
              <Ionicons name="cloudy-night" size={20} color="#b0b4c3" />
              <Text style={styles.hourlyTemp}>29°</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050b18',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#b0b4c3',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2740',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cityInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
  },

  currentWeather: {
    backgroundColor: '#161b2b',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  currentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentTemps: {
    marginLeft: 20,
  },
  currentTemp: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '800',
  },
  feelsLike: {
    color: '#b0b4c3',
    fontSize: 14,
    marginTop: 4,
  },
  conditionText: {
    color: '#ff7a45',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  humidity: {
    color: '#b0b4c3',
    fontSize: 14,
  },

  forecastSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  forecastScroll: {
    paddingBottom: 8,
  },
  weatherCard: {
    backgroundColor: '#1f2740',
    width: 72,
    height: 100,
    borderRadius: 16,
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
  },
  dayText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  tempText: {
    color: '#ff7a45',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },

  hourlySection: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
  },
  hourlyRow: {
    flexDirection: 'row',
  },
  hourlyCard: {
    backgroundColor: '#161b2b',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 60,
  },
  hourText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  hourlyTemp: {
    color: '#ff7a45',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});
