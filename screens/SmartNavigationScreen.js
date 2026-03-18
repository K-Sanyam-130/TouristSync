// screens/SmartNavigationScreen.js
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

const FAKE_PLACES = {
  'Eiffel Tower': { lat: 48.8584, lng: 2.2945 },
  'Louvre Museum': { lat: 48.8606, lng: 2.3376 },
  'Notre Dame': { lat: 48.8530, lng: 2.3499 },
  'Taj Mahal': { lat: 27.1751, lng: 78.0421 },
  'Gateway of India': { lat: 18.9219, lng: 72.8344 },
};

// Fake routes between popular landmarks
const FAKE_ROUTES = {
  'Eiffel Tower to Louvre Museum': {
    distance: '2.3 km',
    duration: '28 min',
    options: [
      {
        type: 'walk',
        time: '28 min',
        distance: '2.3 km',
        steps: 4,
        calories: 180,
        icon: 'walk',
        color: '#4CAF50',
      },
      {
        type: 'metro',
        time: '12 min',
        distance: '2.5 km',
        cost: '€2.10',
        line: 'Line 1',
        icon: 'train',
        color: '#2196F3',
      },
      {
        type: 'cab',
        time: '8 min',
        distance: '2.4 km',
        cost: '€12-15',
        icon: 'car',
        color: '#FF9800',
      },
    ],
  },
  'Gateway of India to Taj Mahal': {
    distance: '230 km',
    duration: '4h 15m',
    options: [
      {
        type: 'train',
        time: '4h 15m',
        distance: '230 km',
        cost: '₹800-1200',
        line: 'Rajdhani Express',
        icon: 'train',
        color: '#2196F3',
      },
      {
        type: 'cab',
        time: '4h 30m',
        distance: '240 km',
        cost: '₹8000-10000',
        icon: 'car',
        color: '#FF9800',
      },
    ],
  },
};

function RouteOption({ option, isActive }) {
  return (
    <TouchableOpacity style={[styles.routeOption, isActive && styles.routeOptionActive]}>
      <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
        <Ionicons name={option.icon} size={20} color={option.color} />
      </View>
      
      <View style={styles.optionInfo}>
        <Text style={styles.optionType}>{option.type.toUpperCase()}</Text>
        <Text style={styles.optionTime}>{option.time}</Text>
        {option.line && <Text style={styles.optionDetail}>{option.line}</Text>}
        {option.cost && <Text style={styles.optionCost}>{option.cost}</Text>}
        {option.calories && <Text style={styles.optionDetail}>{option.calories} cal</Text>}
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#b0b4c3" />
    </TouchableOpacity>
  );
}

export default function SmartNavigationScreen() {
  const [from, setFrom] = useState('Eiffel Tower');
  const [to, setTo] = useState('Louvre Museum');
  const [route, setRoute] = useState(FAKE_ROUTES['Eiffel Tower to Louvre Museum']);
  const [activeOption, setActiveOption] = useState(0);

  const handleSearch = () => {
    const routeKey = `${from} to ${to}`;
    if (FAKE_ROUTES[routeKey]) {
      setRoute(FAKE_ROUTES[routeKey]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Smart Navigation</Text>
        <Text style={styles.subtitle}>
          Find the best routes with public transport
        </Text>
      </View>

      {/* Search inputs */}
      <View style={styles.searchSection}>
        <View style={styles.inputRow}>
          <Ionicons name="location" size={20} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="From: Eiffel Tower"
            placeholderTextColor="#777"
            value={from}
            onChangeText={setFrom}
          />
        </View>

        <View style={styles.swapButton}>
          <Ionicons name="swap-vertical" size={24} color="#ff7a45" />
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="location-sharp" size={20} color="#ff7a45" />
          <TextInput
            style={[styles.input, styles.toInput]}
            placeholder="To: Louvre Museum"
            placeholderTextColor="#777"
            value={to}
            onChangeText={setTo}
          />
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Find Route</Text>
        </TouchableOpacity>
      </View>

      {/* Route summary */}
      {route && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryDistance}>{route.distance}</Text>
            <Text style={styles.summaryDuration}>{route.duration}</Text>
          </View>
          <View style={styles.summaryOptions}>
            <Text style={styles.summaryOption}>3 transport options</Text>
            <Text style={styles.summaryOption}>Updated 2 min ago</Text>
          </View>
        </View>
      )}

      {/* Route options */}
      {route && (
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Best Options</Text>
          {route.options.map((option, index) => (
            <RouteOption
              key={index}
              option={option}
              isActive={activeOption === index}
              onPress={() => setActiveOption(index)}
            />
          ))}
        </View>
      )}

      {/* Route details */}
      {route && route.options[activeOption] && (
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Route Steps</Text>
          
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepNumber}>1</Text>
              <Ionicons name="walk" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.stepTitle}>Walk to Metro Station</Text>
            <Text style={styles.stepDistance}>120m • 2 min</Text>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepNumber}>2</Text>
              <Ionicons name="train" size={20} color="#2196F3" />
            </View>
            <Text style={styles.stepTitle}>Take Metro Line 1</Text>
            <Text style={styles.stepDistance}>2.1 km • 8 min</Text>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepNumber}>3</Text>
              <Ionicons name="walk" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.stepTitle}>Walk to Destination</Text>
            <Text style={styles.stepDistance}>180m • 3 min</Text>
          </View>

          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },

  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b2b',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
  },
  toInput: {
    color: '#ff7a45',
  },
  swapButton: {
    alignItems: 'center',
    marginVertical: 8,
  },
  searchButton: {
    backgroundColor: '#ff7a45',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },

  summaryCard: {
    backgroundColor: '#161b2b',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryDistance: {
    color: '#ff7a45',
    fontSize: 24,
    fontWeight: '700',
  },
  summaryDuration: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  summaryOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryOption: {
    color: '#b0b4c3',
    fontSize: 13,
  },

  optionsSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  routeOption: {
    backgroundColor: '#161b2b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeOptionActive: {
    backgroundColor: '#1f2740',
    borderWidth: 1,
    borderColor: '#ff7a45',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionType: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  optionTime: {
    color: '#ff7a45',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  optionDetail: {
    color: '#b0b4c3',
    fontSize: 13,
    marginTop: 2,
  },
  optionCost: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },

  detailsSection: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingBottom: 40,
  },
  stepCard: {
    backgroundColor: '#161b2b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    backgroundColor: '#ff7a45',
    color: '#ffffff',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 12,
  },
  stepTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  stepDistance: {
    color: '#b0b4c3',
    fontSize: 14,
    marginTop: 4,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  startButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
