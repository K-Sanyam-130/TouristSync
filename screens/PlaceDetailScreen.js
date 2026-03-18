import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlaceDetailScreen({ route, navigation }) {
  const { place } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backRow}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={22} color="#ffffff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{place.name}</Text>
      <Text style={styles.city}>{place.city}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Rank</Text>
        <Text style={styles.value}>#{place.rank} Most visited spot</Text>

        <Text style={styles.label}>Transport</Text>
        <Text style={styles.value}>{place.transport}</Text>

        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}>{place.category}</Text>

        <Text style={styles.label}>Tip</Text>
        <Text style={styles.value}>
          Here we will show tips, opening times and ticket prices from API.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050b18', padding: 20, paddingTop: 50 },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: '#ffffff', marginLeft: 4 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  city: { color: '#b0b4c3', fontSize: 14, marginTop: 4, marginBottom: 16 },
  card: {
    backgroundColor: '#161b2b',
    borderRadius: 18,
    padding: 18,
  },
  label: {
    color: '#b0b4c3',
    fontSize: 12,
    marginTop: 10,
  },
  value: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 4,
  },
});
