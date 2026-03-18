// screens/ExploreScreen.js
import React, { useState } from 'react';
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

const filters = ['All', 'Museums', 'Nature', 'Culture', 'Food'];

const samplePlaces = [
  {
    id: '1',
    rank: 1,
    name: 'Eiffel Tower',
    city: 'Paris',
    category: 'Culture',
    transport: 'Metro: Line 6 • Cab: €12–18',
  },
  {
    id: '2',
    rank: 2,
    name: 'Louvre Museum',
    city: 'Paris',
    category: 'Museums',
    transport: 'Metro: Line 1 • Cab: €8–14',
  },
  {
    id: '3',
    rank: 3,
    name: 'Notre-Dame',
    city: 'Paris',
    category: 'Culture',
    transport: 'Bus: 47 • Cab: €10–16',
  },
  {
    id: '4',
    rank: 4,
    name: 'Montmartre',
    city: 'Paris',
    category: 'Culture',
    transport: 'Metro: Line 2 • Cab: €9–15',
  },
  {
    id: '5',
    rank: 5,
    name: 'Luxembourg Gardens',
    city: 'Paris',
    category: 'Nature',
    transport: 'Metro: Line 4 • Cab: €7–12',
  },
];

function PlaceCard({ place, onPress }) {
  return (
    <TouchableOpacity style={styles.placeCard} onPress = {onPress}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>#{place.rank} Most Visited</Text>
      </View>

      <Text style={styles.placeName}>{place.name}</Text>
      <Text style={styles.placeCity}>{place.city}</Text>

      <View style={styles.transportRow}>
        <Ionicons name="train" size={16} color="#4e8cff" />
        <Text style={styles.transportText}>{place.transport}</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.tagText}>Nearest metro & cab prices</Text>
        <Ionicons name="chevron-forward" size={18} color="#ffffff" />
      </View>
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [city, setCity] = useState('Paris');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredPlaces =
    activeFilter === 'All'
      ? samplePlaces
      : samplePlaces.filter((p) => p.category === activeFilter);

  const renderPlace = ({ item }) => (
    <PlaceCard
      place={item}
      onPress={() => navigation.navigate('PlaceDetail', { place: item })}
    />
  );


  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerArea}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover top tourist spots worldwide</Text>

        {/* search city */}
        <View style={styles.searchBox}>
          <Ionicons name="location" size={18} color="#888" />
          <TextInput
            placeholder="Enter city (Paris, Tokyo...)"
            placeholderTextColor="#777"
            style={styles.searchInput}
            value={city}
            onChangeText={setCity}
          />
          <TouchableOpacity style={styles.goButton}>
            <Text style={styles.goText}>Go</Text>
          </TouchableOpacity>
        </View>

        {/* filter chips */}
        <View style={styles.filterRow}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                activeFilter === f && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* list */}
      <View style={styles.listArea}>
        <Text style={styles.sectionTitle}>Top 5 in {city}</Text>
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item.id}
          renderItem={renderPlace}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
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
    paddingBottom: 16,
    backgroundColor: '#131b33',
  },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#b0b4c3', fontSize: 13, marginTop: 4 },

  searchBox: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2740',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    color: '#ffffff',
    fontSize: 14,
  },
  goButton: {
    backgroundColor: '#ff7a45',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
  },
  goText: { color: '#ffffff', fontWeight: '600', fontSize: 13 },

  filterRow: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2b3350',
    marginRight: 8,
    marginBottom: 6,
  },
  filterChipActive: {
    backgroundColor: '#ff7a45',
    borderColor: '#ff7a45',
  },
  filterText: { color: '#d0d3e0', fontSize: 12 },
  filterTextActive: { color: '#ffffff' },

  listArea: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  placeCard: {
    backgroundColor: '#161b2b',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffe7d6',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  badgeText: { color: '#d45a1b', fontSize: 11, fontWeight: '600' },
  placeName: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  placeCity: { color: '#b0b4c3', fontSize: 12, marginTop: 2 },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  transportText: {
    color: '#d0e0ff',
    fontSize: 12,
    marginLeft: 6,
  },
  footerRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagText: { color: '#c3c6d6', fontSize: 12 },
});
