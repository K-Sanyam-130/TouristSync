// screens/HomeScreen.js
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// data for the quick tools
const tools = [
  { id: '1', title: 'Image Translator', icon: 'image' },
  { id: '2', title: 'Voice Translator', icon: 'mic' },
  { id: '3', title: 'Smart Navigation', icon: 'map' },
  { id: '4', title: 'Currency Converter', icon: 'cash' },
  { id: '5', title: 'Weather Forecast', icon: 'cloud' },
  { id: '6', title: 'Emergency SOS', icon: 'alert' },
];

// data for recently visited cities
const recentCities = ['Paris', 'Tokyo', 'Dubai', 'New York'];

// small reusable card for each tool
function FeatureCard({ icon, title, onPress }) {
  return (
    <TouchableOpacity style={styles.toolCard} onPress={onPress}>
      <Ionicons name={icon} size={26} color="#ff7a45" />
      <Text style={styles.toolTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

// card for each recently visited city
function CityCard({ name }) {
  return (
    <View style={styles.cityCard}>
      <Ionicons name="location" size={18} color="#ff7a45" />
      <Text style={styles.cityName}>{name}</Text>
      <Text style={styles.citySubtitle}>3 spots visited</Text>
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const renderTool = ({ item }) => {
    const map = {
      'Image Translator': 'ImageTranslator',
      'Voice Translator': 'VoiceTranslator',
      'Smart Navigation': 'SmartNavigation',
      'Currency Converter': 'CurrencyConverter',
      'Weather Forecast': 'Weather',
      'Emergency SOS': 'Emergency',
    };

    return (
      <FeatureCard
        icon={item.icon}
        title={item.title}
        onPress={() => navigation.navigate(map[item.title])}
      />
    );
  };


  const renderCity = ({ item }) => <CityCard name={item} />;

  return (
    <View style={styles.container}>
      {/* top gradient-like header */}
      <View style={styles.headerArea}>
        <Text style={styles.greeting}>Good Morning 🌤️</Text>
        <Text style={styles.heading}>Where to next?</Text>
        <Text style={styles.subheading}>
          Explore the world with confidence.
        </Text>

        {/* search bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            placeholder="Search destinations..."
            placeholderTextColor="#777"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* main content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Tools</Text>
        <FlatList
          data={tools}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={renderTool}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        />

        {/* orange promo banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Travel Smart 🌍</Text>
          <Text style={styles.bannerText}>
            Offline mode now available. Try it on your next trip.
          </Text>
        </View>

        {/* recently visited */}
        <Text style={styles.sectionTitle}>Recently Visited</Text>
        <FlatList
          data={recentCities}
          horizontal
          keyExtractor={(item) => item}
          renderItem={renderCity}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050b18' },

  headerArea: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#131b33',
  },
  greeting: { color: '#ffffff', fontSize: 14, marginBottom: 4 },
  heading: { color: '#ffffff', fontSize: 26, fontWeight: '700' },
  subheading: { color: '#b0b4c3', fontSize: 13, marginTop: 4 },

  searchBox: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2740',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    marginLeft: 8,
    color: '#ffffff',
    flex: 1,
    fontSize: 14,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 4,
  },

  toolCard: {
    backgroundColor: '#161b2b',
    width: '31%',
    borderRadius: 18,
    paddingVertical: 18,
    marginBottom: 12,
    alignItems: 'center',
  },
  toolTitle: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },

  banner: {
    marginTop: 10,
    backgroundColor: '#ff7a45',
    borderRadius: 18,
    padding: 16,
  },
  bannerTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  bannerText: { color: '#fff5ec', fontSize: 12, marginTop: 4 },

  cityCard: {
    backgroundColor: '#161b2b',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginRight: 10,
    alignItems: 'flex-start',
  },
  cityName: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '600',
  },
  citySubtitle: { color: '#b0b4c3', fontSize: 11, marginTop: 2 },
});
