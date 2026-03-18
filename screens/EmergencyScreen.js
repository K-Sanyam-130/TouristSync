// screens/EmergencyScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EMERGENCY_NUMBERS = {
  India: {
    police: '100',
    ambulance: '108',
    fire: '101',
    womenHelpline: '181',
    touristPolice: '1098',
  },
  France: {
    police: '17',
    ambulance: '15',
    fire: '18',
    emergency: '112',
    touristPolice: '01 49 27 28 28',
  },
  USA: {
    police: '911',
    ambulance: '911',
    fire: '911',
    emergency: '911',
  },
};

const LOCAL_SERVICES = {
  'Paris': {
    hospitals: ['Hôpital Cochin', 'Hôpital Lariboisière'],
    police: ['Tourist Police Paris', '1st Arrondissement Police'],
    embassies: ['Indian Embassy Paris'],
  },
  'Mumbai': {
    hospitals: ['Lilavati Hospital', 'Kokilaben Hospital'],
    police: ['Mumbai Tourist Police', 'Colaba Police Station'],
    embassies: ['US Consulate Mumbai'],
  },
};

function EmergencyButton({ onPress, isActive }) {
  return (
    <TouchableOpacity
      style={[styles.sosButton, isActive && styles.sosButtonActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="ios-warning" size={48} color="#ffffff" />
      <Text style={styles.sosText}>SOS</Text>
      <Text style={styles.sosSubtext}>HOLD 3 SECONDS</Text>
    </TouchableOpacity>
  );
}

function ContactRow({ icon, title, number, onPress }) {
  return (
    <TouchableOpacity style={styles.contactRow} onPress={onPress}>
      <View style={[styles.contactIcon, { backgroundColor: icon === 'medical' ? '#4CAF50' : '#FF4444' }]}>
        <Ionicons name={icon} size={20} color="#ffffff" />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactNumber}>{number}</Text>
      </View>
      <Ionicons name="call-outline" size={24} color="#4CAF50" />
    </TouchableOpacity>
  );
}

export default function EmergencyScreen() {
  const [currentCountry, setCurrentCountry] = useState('India');
  const [sosHoldTime, setSosHoldTime] = useState(0);
  const [sosActive, setSosActive] = useState(false);
  const [currentCity, setCurrentCity] = useState('Mumbai');

  const handleSOSPress = () => {
    const timeout = setInterval(() => {
      setSosHoldTime((prev) => {
        if (prev >= 3) {
          clearInterval(timeout);
          handleEmergency();
          return prev;
        }
        return prev + 0.1;
      });
    }, 100);
    
    setTimeout(() => {
      clearInterval(timeout);
      setSosHoldTime(0);
    }, 4000);
  };

  const handleEmergency = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS ACTIVATED',
      `Sending distress signal with your location:\n\n📍 Current location: ${currentCity}\n📞 Calling ${EMERGENCY_NUMBERS[currentCountry].police}\n📱 Alerting 3 emergency contacts\n\n✅ Location shared with authorities`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm SOS', onPress: () => {
          Alert.alert('SOS SENT!', 'Emergency services notified. Help is on the way.');
          setSosActive(false);
        }},
      ]
    );
  };

  const callEmergency = (number) => {
    Alert.alert('Calling...', `${number}\n\n(In demo: opens phone dialer)`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.subtitle}>
          Hold SOS button for immediate help
        </Text>
      </View>

      {/* SOS Button - Center of screen */}
      <View style={styles.sosContainer}>
        <EmergencyButton
          onPress={handleSOSPress}
          isActive={sosHoldTime > 0}
        />
        {sosHoldTime > 0 && (
          <Text style={styles.holdCounter}>
            Hold: {Math.round(sosHoldTime * 10) / 10}s
          </Text>
        )}
      </View>

      {/* Quick country selector */}
      <View style={styles.countrySelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['India', 'France', 'USA', 'Japan', 'UAE'].map((country) => (
            <TouchableOpacity
              key={country}
              style={[
                styles.countryChip,
                currentCountry === country && styles.countryChipActive,
              ]}
              onPress={() => setCurrentCountry(country)}
            >
              <Text
                style={[
                  styles.countryText,
                  currentCountry === country && styles.countryTextActive,
                ]}
              >
                {country}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Emergency Numbers */}
      <View style={styles.numbersSection}>
        <Text style={styles.sectionTitle}>Emergency Numbers</Text>
        <ContactRow
          icon="call"
          title="Police"
          number={EMERGENCY_NUMBERS[currentCountry]?.police || '100'}
          onPress={() => callEmergency(EMERGENCY_NUMBERS[currentCountry]?.police)}
        />
        <ContactRow
          icon="medical"
          title="Ambulance"
          number={EMERGENCY_NUMBERS[currentCountry]?.ambulance || '108'}
          onPress={() => callEmergency(EMERGENCY_NUMBERS[currentCountry]?.ambulance)}
        />
        <ContactRow
          icon="flame"
          title="Fire Department"
          number={EMERGENCY_NUMBERS[currentCountry]?.fire || '101'}
          onPress={() => callEmergency(EMERGENCY_NUMBERS[currentCountry]?.fire)}
        />
      </View>

      {/* Local Services */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Nearby Services ({currentCity})</Text>
        <View style={styles.serviceRow}>
          <TouchableOpacity style={styles.serviceButton}>
            <Ionicons name="hospital" size={20} color="#4CAF50" />
            <Text style={styles.serviceText}>Hospitals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceButton}>
            <Ionicons name="shield-checkmark" size={20} color="#2196F3" />
            <Text style={styles.serviceText}>Police Stations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceButton}>
            <Ionicons name="flag" size={20} color="#FF9800" />
            <Text style={styles.serviceText}>Embassies</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Emergency Contacts */}
      <View style={styles.contactsSection}>
        <Text style={styles.sectionTitle}>My Emergency Contacts</Text>
        <View style={styles.contactList}>
          <ContactRow
            icon="person"
            title="Family - Priya"
            number="+91 98765 43210"
            onPress={() => callEmergency('+91 98765 43210')}
          />
          <ContactRow
            icon="person"
            title="Friend - Rohan"
            number="+91 99887 77665"
            onPress={() => callEmergency('+91 99887 77665')}
          />
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
    alignItems: 'center',
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
    textAlign: 'center',
  },

  sosContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  sosButton: {
    backgroundColor: '#FF4444',
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  sosButtonActive: {
    backgroundColor: '#CC0000',
    transform: [{ scale: 1.05 }],
  },
  sosText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },
  sosSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  holdCounter: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },

  countrySelector: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  countryChip: {
    backgroundColor: '#1f2740',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  countryChipActive: {
    backgroundColor: '#ff7a45',
  },
  countryText: {
    color: '#d0d3e0',
    fontSize: 14,
    fontWeight: '600',
  },
  countryTextActive: {
    color: '#ffffff',
  },

  numbersSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  contactsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },

  contactRow: {
    backgroundColor: '#161b2b',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  contactNumber: {
    color: '#b0b4c3',
    fontSize: 14,
    marginTop: 2,
  },

  serviceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceButton: {
    flex: 1,
    backgroundColor: '#161b2b',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
  },
  serviceText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
