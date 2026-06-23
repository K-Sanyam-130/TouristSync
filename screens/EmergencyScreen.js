// screens/EmergencyScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Animated,
  Dimensions,
  Platform,
  Linking,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../constants/ThemeContext';
import { useAuth } from '../constants/AuthContext';
import Svg, { Circle } from 'react-native-svg';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import api from '../services/api';

import GlassCard from '../components/ui/GlassCard';
import StaggerRevealText from '../components/ui/StaggerRevealText';
import FloatingParticles from '../components/ui/FloatingParticles';
import PressableGoldButton from '../components/ui/PressableGoldButton';

const { width: SCREEN_W } = Dimensions.get('window');
const SOS_SETUP_KEY = '@touristguide_sos_setup';
const MEDICAL_INFO_KEY = '@touristguide_medical_info';

// SOS hold duration in seconds
const SOS_HOLD_DURATION = 3;

const COUNTRY_FLAGS = {
  India: '🇮🇳',
  France: '🇫🇷',
  USA: '🇺🇸',
  Japan: '🇯🇵',
  UAE: '🇦🇪',
  UK: '🇬🇧',
  Australia: '🇦🇺',
  Thailand: '🇹🇭',
  Singapore: '🇸🇬',
};

const EMERGENCY_NUMBERS = {
  India: {
    police: { number: '100', label: 'Police Control' },
    ambulance: { number: '108', label: 'National Ambulance' },
    fire: { number: '101', label: 'Fire Brigade' },
    womenHelpline: { number: '181', label: 'Women Helpline' },
    touristPolice: { number: '1363', label: 'Tourist Helpline' },
  },
  France: {
    police: { number: '17', label: 'Police Secours' },
    ambulance: { number: '15', label: 'SAMU' },
    fire: { number: '18', label: 'Pompiers' },
    emergency: { number: '112', label: 'European Emergency' },
  },
  USA: {
    police: { number: '911', label: 'Universal Emergency' },
    ambulance: { number: '911', label: 'Universal Emergency' },
    fire: { number: '911', label: 'Universal Emergency' },
  },
  Japan: {
    police: { number: '110', label: 'Keisatsu' },
    ambulance: { number: '119', label: 'Kyūkyū' },
    fire: { number: '119', label: 'Shōbōsha' },
  },
  UAE: {
    police: { number: '999', label: 'Police' },
    ambulance: { number: '998', label: 'Ambulance' },
    fire: { number: '997', label: 'Civil Defence' },
  },
  UK: {
    police: { number: '999', label: 'Emergency Services' },
    ambulance: { number: '999', label: 'Emergency Services' },
    fire: { number: '999', label: 'Emergency Services' },
    emergency: { number: '112', label: 'European Emergency' },
  },
  Australia: {
    police: { number: '000', label: 'Triple Zero' },
    ambulance: { number: '000', label: 'Triple Zero' },
    fire: { number: '000', label: 'Triple Zero' },
    emergency: { number: '112', label: 'Mobile Emergency' },
  },
  Thailand: {
    police: { number: '191', label: 'Police' },
    ambulance: { number: '1669', label: 'Medical Emergency' },
    fire: { number: '199', label: 'Fire Brigade' },
    touristPolice: { number: '1155', label: 'Tourist Police' },
  },
  Singapore: {
    police: { number: '999', label: 'Police' },
    ambulance: { number: '995', label: 'SCDF' },
    fire: { number: '995', label: 'SCDF' },
  },
};

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ── Animated SOS Ring ─────────────────────────────────────
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function SOSButton({ onActivate, theme }) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const holdTimerRef = useRef(null);
  const activatedRef = useRef(false);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  // Pulsing animation for the outer ring
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const RING_SIZE = 180;
  const RING_STROKE = 6;
  const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [RING_CIRCUMFERENCE, 0],
  });

  // Use a single listener on progressAnim to drive both ring and bar in sync
  const lastTickRef = useRef(0);

  const handlePressIn = () => {
    activatedRef.current = false;
    lastTickRef.current = 0;
    setHolding(true);
    setHoldProgress(0);
    Vibration.vibrate(50);

    Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    // Single animation drives everything
    progressAnim.setValue(0);
    const listenerId = progressAnim.addListener(({ value }) => {
      const elapsed = value * SOS_HOLD_DURATION;
      setHoldProgress(elapsed);

      // Haptic tick each second
      const currentSecond = Math.floor(elapsed);
      if (currentSecond > lastTickRef.current && currentSecond < SOS_HOLD_DURATION) {
        lastTickRef.current = currentSecond;
        Vibration.vibrate(30);
      }

      // Trigger SOS when complete
      if (value >= 1 && !activatedRef.current) {
        activatedRef.current = true;
        Vibration.vibrate([0, 200, 100, 200]);
        onActivate();
      }
    });
    holdTimerRef.current = listenerId;

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: SOS_HOLD_DURATION * 1000,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    setHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current !== null) {
      progressAnim.removeListener(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    progressAnim.stopAnimation();
    Animated.timing(progressAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    Animated.timing(glowAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };

  // Bar width driven by same progressAnim
  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.sosContainer}>
      {/* Outer pulse ring */}
      <Animated.View style={[styles.sosOuterPulse, {
        transform: [{ scale: pulseAnim }],
        borderColor: holding ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.15)',
      }]} />

      {/* SVG progress ring */}
      <View style={styles.sosRingWrapper}>
        <Svg width={RING_SIZE} height={RING_SIZE} style={styles.sosSvg}>
          {/* Background ring */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke="rgba(239, 68, 68, 0.15)"
            strokeWidth={RING_STROKE}
            fill="none"
          />
          {/* Progress ring */}
          <AnimatedCircle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke={theme.colors.crimson}
            strokeWidth={RING_STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
          />
        </Svg>

        {/* SOS Button */}
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.sosButton,
            {
              backgroundColor: pressed || holding ? '#CC0000' : theme.colors.crimson,
              shadowColor: theme.colors.crimson,
              transform: [{ scale: holding ? 0.95 : 1 }],
            },
          ]}
        >
          <Animated.View style={{ opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.7] }) }}>
            <Ionicons name="warning" size={44} color={theme.colors.ivory} />
          </Animated.View>
          <Text style={[theme.typography.headingM, styles.sosText, { color: theme.colors.ivory }]}>SOS</Text>
          <Text style={[theme.typography.caption, styles.sosSubtext, { color: theme.colors.ivory, opacity: 0.8 }]}>
            HOLD {SOS_HOLD_DURATION}s
          </Text>
        </Pressable>
      </View>

      {/* Hold progress bar — driven by same Animated.Value as ring */}
      {holding && (
        <View style={styles.holdIndicator}>
          <View style={[styles.holdProgressBar, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
            <Animated.View style={[styles.holdProgressFill, {
              backgroundColor: theme.colors.crimson,
              width: barWidth,
            }]} />
          </View>
          <Text style={[styles.holdCounter, { color: theme.colors.crimson }]}>
            {Math.ceil(SOS_HOLD_DURATION - holdProgress)}s remaining
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Get Started Screen ──────────────────────────────────
function GetStartedScreen({ onGetStarted, theme }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 8 }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.obsidian }]}>
      <FloatingParticles count={10} />
      <LinearGradient
        colors={[theme.colors.obsidian, '#0A0F1C', theme.colors.deepNavy]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.getStartedContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Icon */}
        <View style={[styles.getStartedIcon, { borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
          <LinearGradient
            colors={['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.05)']}
            style={styles.getStartedIconGradient}
          >
            <Ionicons name="shield-checkmark" size={48} color={theme.colors.crimson} />
          </LinearGradient>
        </View>

        <Text style={[theme.typography.displayM, { color: theme.colors.ivory, textAlign: 'center', marginTop: 24 }]}>
          Emergency SOS
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.parchment, textAlign: 'center', marginTop: 12, paddingHorizontal: 30, lineHeight: 22 }]}>
          Set up your emergency contacts and get instant access to local emergency numbers, nearby hospitals, and one-tap SOS alerts when you travel.
        </Text>

        {/* Feature highlights */}
        <View style={styles.featureList}>
          {[
            { icon: 'call', label: 'One-tap real dialing to emergency services' },
            { icon: 'people', label: 'Store personal emergency contacts' },
            { icon: 'medkit', label: 'Medical info card for first responders' },
            { icon: 'alert-circle', label: 'SOS distress signal with countdown' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureDot, { backgroundColor: theme.colors.crimson + '25' }]}>
                <Ionicons name={f.icon} size={16} color={theme.colors.crimson} />
              </View>
              <Text style={[theme.typography.body, { color: theme.colors.ivory, fontSize: 14 }]}>{f.label}</Text>
            </View>
          ))}
        </View>

        <PressableGoldButton
          label="Get Started"
          onPress={onGetStarted}
          icon={<Ionicons name="arrow-forward" size={18} color={theme.colors.ivory} />}
          style={{ marginTop: 32, width: SCREEN_W - 80 }}
        />
      </Animated.View>
    </View>
  );
}

// ── Reusable Components ─────────────────────────────────
function ContactRow({ icon, title, number, subtitle, onPress, iconColor }) {
  const { theme } = useTheme();
  return (
    <GlassCard style={styles.contactRow} onPress={onPress} glowOnPress={false}>
      <View style={[styles.contactIcon, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={[theme.typography.body, { color: theme.colors.ivory }]}>{title}</Text>
        <Text style={[theme.typography.caption, { color: theme.colors.parchment, marginTop: 2 }]}>
          {subtitle ? `${number} · ${subtitle}` : number}
        </Text>
      </View>
      <View style={[styles.callBtnCircle, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name="call" size={18} color={iconColor} />
      </View>
    </GlassCard>
  );
}

// ── Medical Info Card Component ─────────────────────────
function MedicalInfoCard({ medicalInfo, editingMedical, setEditingMedical, updateMedical, saveMedicalInfo, theme }) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="medkit" size={18} color={theme.colors.emerald} />
          <Text style={[theme.typography.headingM, { color: theme.colors.ivory }]}>Medical Info</Text>
        </View>
        <TouchableOpacity onPress={() => editingMedical ? saveMedicalInfo() : setEditingMedical(true)}>
          <Ionicons name={editingMedical ? 'checkmark-circle' : 'create-outline'} size={22} color={theme.colors.emerald} />
        </TouchableOpacity>
      </View>
      <Text style={[theme.typography.caption, { color: theme.colors.parchment, marginTop: -8, marginBottom: 12 }]}>
        Visible to first responders in an emergency
      </Text>

      {editingMedical ? (
        <GlassCard style={styles.editContactCard} glowOnPress={false}>
          {/* Blood Type Selector */}
          <Text style={[theme.typography.caption, { color: theme.colors.parchment, marginBottom: 8 }]}>Blood Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {BLOOD_TYPES.map((bt) => {
                const isActive = medicalInfo.bloodType === bt;
                return (
                  <TouchableOpacity
                    key={bt}
                    style={[
                      styles.bloodTypeChip,
                      { borderColor: isActive ? theme.colors.crimson : theme.colors.borderSilver },
                      isActive && { backgroundColor: theme.colors.crimson },
                    ]}
                    onPress={() => updateMedical('bloodType', bt)}
                  >
                    <Text style={[theme.typography.label, {
                      color: isActive ? '#fff' : theme.colors.parchment,
                      fontSize: 13,
                    }]}>{bt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <TextInput
            style={[styles.contactInput, { backgroundColor: theme.colors.midnight, color: theme.colors.ivory }]}
            placeholder="Allergies (e.g. Penicillin, Peanuts)"
            placeholderTextColor={theme.colors.ash}
            value={medicalInfo.allergies}
            onChangeText={(v) => updateMedical('allergies', v)}
          />
          <TextInput
            style={[styles.contactInput, { backgroundColor: theme.colors.midnight, color: theme.colors.ivory }]}
            placeholder="Current Medications"
            placeholderTextColor={theme.colors.ash}
            value={medicalInfo.medications}
            onChangeText={(v) => updateMedical('medications', v)}
          />
          <TextInput
            style={[styles.contactInput, styles.notesInput, { backgroundColor: theme.colors.midnight, color: theme.colors.ivory }]}
            placeholder="Medical conditions / notes for responders"
            placeholderTextColor={theme.colors.ash}
            value={medicalInfo.conditions}
            onChangeText={(v) => updateMedical('conditions', v)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <PressableGoldButton
            label="Save Medical Info"
            onPress={saveMedicalInfo}
            icon={<Ionicons name="checkmark-circle" size={18} color={theme.colors.ivory} />}
            style={{ marginTop: 8, marginHorizontal: 0 }}
          />
        </GlassCard>
      ) : (
        <GlassCard style={styles.medicalCard} glowOnPress={false}>
          {medicalInfo.bloodType || medicalInfo.allergies || medicalInfo.medications || medicalInfo.conditions ? (
            <View style={{ gap: 12 }}>
              {medicalInfo.bloodType ? (
                <View style={styles.medicalRow}>
                  <View style={[styles.medicalIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                    <Ionicons name="water" size={16} color={theme.colors.crimson} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[theme.typography.caption, { color: theme.colors.parchment }]}>Blood Type</Text>
                    <Text style={[theme.typography.body, { color: theme.colors.ivory, fontWeight: '700', fontSize: 18 }]}>
                      {medicalInfo.bloodType}
                    </Text>
                  </View>
                </View>
              ) : null}
              {medicalInfo.allergies ? (
                <View style={styles.medicalRow}>
                  <View style={[styles.medicalIconBg, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <Ionicons name="alert-circle" size={16} color="#F59E0B" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[theme.typography.caption, { color: theme.colors.parchment }]}>Allergies</Text>
                    <Text style={[theme.typography.body, { color: '#F59E0B', fontWeight: '600' }]}>
                      {medicalInfo.allergies}
                    </Text>
                  </View>
                </View>
              ) : null}
              {medicalInfo.medications ? (
                <View style={styles.medicalRow}>
                  <View style={[styles.medicalIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Ionicons name="fitness" size={16} color={theme.colors.emerald} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[theme.typography.caption, { color: theme.colors.parchment }]}>Medications</Text>
                    <Text style={[theme.typography.body, { color: theme.colors.ivory }]}>
                      {medicalInfo.medications}
                    </Text>
                  </View>
                </View>
              ) : null}
              {medicalInfo.conditions ? (
                <View style={styles.medicalRow}>
                  <View style={[styles.medicalIconBg, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                    <Ionicons name="document-text" size={16} color="#6366F1" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[theme.typography.caption, { color: theme.colors.parchment }]}>Conditions</Text>
                    <Text style={[theme.typography.body, { color: theme.colors.ivory }]}>
                      {medicalInfo.conditions}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Ionicons name="medkit-outline" size={28} color={theme.colors.ash} />
              <Text style={[theme.typography.body, { color: theme.colors.parchment, marginTop: 8, textAlign: 'center' }]}>
                No medical info added yet
              </Text>
              <TouchableOpacity
                style={[styles.addContactBtn, { borderColor: theme.colors.emerald }]}
                onPress={() => setEditingMedical(true)}
              >
                <Ionicons name="add" size={16} color={theme.colors.emerald} />
                <Text style={[theme.typography.label, { color: theme.colors.emerald, marginLeft: 4 }]}>Add Medical Info</Text>
              </TouchableOpacity>
            </View>
          )}
        </GlassCard>
      )}
    </View>
  );
}

// ── Main Screen ─────────────────────────────────────────
export default function EmergencyScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isSetup, setIsSetup] = useState(null); // null = loading
  const [currentCountry, setCurrentCountry] = useState('India');

  // Personal contacts
  const [contacts, setContacts] = useState([
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' },
  ]);
  const [editingContacts, setEditingContacts] = useState(false);
  const { user } = useAuth();

  // Medical info
  const [medicalInfo, setMedicalInfo] = useState({
    bloodType: '',
    allergies: '',
    medications: '',
    conditions: '',
  });
  const [editingMedical, setEditingMedical] = useState(false);

  // Load saved setup state
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SOS_SETUP_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setIsSetup(true);
          if (data.contacts) setContacts(data.contacts);
        } else {
          setIsSetup(false);
        }

        // Load medical info
        const medStored = await AsyncStorage.getItem(MEDICAL_INFO_KEY);
        if (medStored) {
          setMedicalInfo(JSON.parse(medStored));
        }
      } catch {
        setIsSetup(false);
      }
    })();
  }, []);

  const handleGetStarted = async () => {
    setIsSetup(true);
    setEditingContacts(true);
    try {
      await AsyncStorage.setItem(SOS_SETUP_KEY, JSON.stringify({ contacts, setupAt: new Date().toISOString() }));
    } catch {}
  };

  const saveContacts = async () => {
    setEditingContacts(false);
    try {
      await AsyncStorage.setItem(SOS_SETUP_KEY, JSON.stringify({ contacts, setupAt: new Date().toISOString() }));
      Alert.alert('Saved', 'Emergency contacts updated.');
    } catch {
      Alert.alert('Error', 'Could not save contacts.');
    }
  };

  const updateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const updateMedical = (field, value) => {
    setMedicalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const saveMedicalInfo = async () => {
    setEditingMedical(false);
    try {
      await AsyncStorage.setItem(MEDICAL_INFO_KEY, JSON.stringify(medicalInfo));
      Alert.alert('Saved', 'Medical information updated.');
    } catch {
      Alert.alert('Error', 'Could not save medical info.');
    }
  };

  // ── Real phone dialing ──
  const callEmergency = (number) => {
    const cleanNumber = number.replace(/\s+/g, '');
    const phoneUrl = Platform.OS === 'android' ? `tel:${cleanNumber}` : `telprompt:${cleanNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Cannot dial', `Unable to open the phone dialer for ${number}. Please dial manually.`);
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Could not open phone dialer.');
      });
  };

  // ── SOS activated — email via backend (automatic) + open SMS compose ──
  const handleSOSActivated = async () => {
    const savedContacts = contacts.filter(c => c.name && c.phone);
    if (savedContacts.length === 0) {
      Alert.alert(
        'No Emergency Contacts',
        'Please add at least one emergency contact before using SOS.',
        [{ text: 'Add Now', onPress: () => setEditingContacts(true) }]
      );
      return;
    }

    try {
      // 1. Get GPS location
      const { status } = await Location.requestForegroundPermissionsAsync();
      let latitude = null;
      let longitude = null;
      let locationText = '';

      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        locationText = `\n\n📍 Live Location:\n${mapsLink}\n\nCoordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      } else {
        locationText = '\n\n📍 Location: Could not determine (permission denied)';
      }

      // 2. Send email via backend (automatic, no user action needed)
      const emailContacts = savedContacts.filter(c => c.email && c.email.includes('@'));
      if (emailContacts.length > 0) {
        api.post('/sos', {
          userName: user?.name || user?.displayName || 'TouristGuide User',
          latitude,
          longitude,
          contacts: emailContacts.map(c => ({ name: c.name, email: c.email })),
        }).then(() => {
          console.log('✅ SOS email sent successfully');
        }).catch((err) => {
          console.error('SOS email failed:', err.message);
        });
      }

      // 3. Open SMS compose screen (user taps send)
      const timestamp = new Date().toLocaleString();
      const message = `🆘 EMERGENCY SOS ALERT 🆘\n\nThis is an emergency distress signal sent from TouristGuide app by ${user?.name || 'a user'}.\n\nTime: ${timestamp}${locationText}\n\nPlease respond immediately or contact local emergency services.`;

      const smsAvailable = await SMS.isAvailableAsync();
      if (smsAvailable) {
        const phoneNumbers = savedContacts.map(c => c.phone);
        await SMS.sendSMSAsync(phoneNumbers, message);
      } else {
        const fallbackNumber = savedContacts[0].phone.replace(/\s+/g, '');
        const encodedMsg = encodeURIComponent(message);
        const smsUrl = Platform.OS === 'android'
          ? `sms:${fallbackNumber}?body=${encodedMsg}`
          : `sms:${fallbackNumber}&body=${encodedMsg}`;
        await Linking.openURL(smsUrl);
      }
    } catch (err) {
      console.error('SOS Error:', err);
      Alert.alert('SOS Error', 'Could not send the emergency alert. Please call emergency services manually.');
    }
  };

  // Still loading
  if (isSetup === null) return <View style={[styles.container, { backgroundColor: theme.colors.obsidian }]} />;

  // Not set up yet — show Get Started
  if (!isSetup) {
    return <GetStartedScreen onGetStarted={handleGetStarted} theme={theme} />;
  }

  const countryNums = EMERGENCY_NUMBERS[currentCountry] || EMERGENCY_NUMBERS.India;

  // ── Full SOS Screen ──────────────────────────────────
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.obsidian }]} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <FloatingParticles count={10} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.midnight }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center' }}
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.crimson} />
          </TouchableOpacity>
          <StaggerRevealText text="Emergency SOS" style={[theme.typography.displayS, { color: theme.colors.crimson }]} />
        </View>
        <Text style={[theme.typography.caption, styles.subtitle, { color: theme.colors.parchment }]}>
          Hold SOS button for {SOS_HOLD_DURATION} seconds to activate
        </Text>
      </View>

      {/* SOS Button with animated ring */}
      <SOSButton onActivate={handleSOSActivated} theme={theme} />

      {/* Country selector with flags */}
      <View style={styles.countrySelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {Object.keys(EMERGENCY_NUMBERS).map((country) => {
            const isActive = currentCountry === country;
            return (
              <TouchableOpacity
                key={country}
                style={[
                  styles.countryChip,
                  { borderColor: isActive ? theme.colors.crimson : theme.colors.borderSilver },
                  isActive && { backgroundColor: theme.colors.crimson },
                ]}
                onPress={() => setCurrentCountry(country)}
              >
                <Text style={{ fontSize: 16, marginRight: 6 }}>{COUNTRY_FLAGS[country] || '🌍'}</Text>
                <Text style={[theme.typography.label, { color: isActive ? theme.colors.ivory : theme.colors.parchment }]}>
                  {country}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Emergency Numbers */}
      <View style={styles.sectionContainer}>
        <Text style={[theme.typography.headingM, styles.sectionTitle, { color: theme.colors.ivory }]}>
          {COUNTRY_FLAGS[currentCountry]} Emergency Numbers
        </Text>
        <ContactRow
          icon="shield-checkmark"
          title="Police"
          number={countryNums.police?.number || '100'}
          subtitle={countryNums.police?.label}
          onPress={() => callEmergency(countryNums.police?.number || '100')}
          iconColor={theme.colors.sapphire || '#2196F3'}
        />
        <ContactRow
          icon="medical"
          title="Ambulance"
          number={countryNums.ambulance?.number || '108'}
          subtitle={countryNums.ambulance?.label}
          onPress={() => callEmergency(countryNums.ambulance?.number || '108')}
          iconColor={theme.colors.emerald}
        />
        <ContactRow
          icon="flame"
          title="Fire Department"
          number={countryNums.fire?.number || '101'}
          subtitle={countryNums.fire?.label}
          onPress={() => callEmergency(countryNums.fire?.number || '101')}
          iconColor={theme.colors.crimson}
        />
        {countryNums.touristPolice && (
          <ContactRow
            icon="globe"
            title="Tourist Helpline"
            number={countryNums.touristPolice.number}
            subtitle={countryNums.touristPolice.label}
            onPress={() => callEmergency(countryNums.touristPolice.number)}
            iconColor={theme.colors.gold}
          />
        )}
        {countryNums.womenHelpline && (
          <ContactRow
            icon="female"
            title="Women Helpline"
            number={countryNums.womenHelpline.number}
            subtitle={countryNums.womenHelpline.label}
            onPress={() => callEmergency(countryNums.womenHelpline.number)}
            iconColor="#EC4899"
          />
        )}
        {countryNums.emergency && (
          <ContactRow
            icon="alert-circle"
            title="Universal Emergency"
            number={countryNums.emergency.number}
            subtitle={countryNums.emergency.label}
            onPress={() => callEmergency(countryNums.emergency.number)}
            iconColor="#F59E0B"
          />
        )}
      </View>

      {/* Medical Info Card */}
      <MedicalInfoCard
        medicalInfo={medicalInfo}
        editingMedical={editingMedical}
        setEditingMedical={setEditingMedical}
        updateMedical={updateMedical}
        saveMedicalInfo={saveMedicalInfo}
        theme={theme}
      />

      {/* Personal Emergency Contacts */}
      <View style={[styles.sectionContainer, { paddingBottom: 20 }]}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="people" size={18} color={theme.colors.gold} />
            <Text style={[theme.typography.headingM, { color: theme.colors.ivory }]}>My Emergency Contacts</Text>
          </View>
          <TouchableOpacity onPress={() => editingContacts ? saveContacts() : setEditingContacts(true)}>
            <Ionicons name={editingContacts ? 'checkmark-circle' : 'create-outline'} size={22} color={theme.colors.gold} />
          </TouchableOpacity>
        </View>

        {editingContacts ? (
          <View style={{ marginTop: 4 }}>
            {contacts.map((c, i) => (
              <GlassCard key={i} style={styles.editContactCard} glowOnPress={false}>
                <Text style={[theme.typography.caption, { color: theme.colors.parchment, marginBottom: 6 }]}>Contact {i + 1}</Text>
                <TextInput
                  style={[styles.contactInput, { backgroundColor: theme.colors.midnight, color: theme.colors.ivory }]}
                  placeholder="Name (e.g. Mom, Friend)"
                  placeholderTextColor={theme.colors.ash}
                  value={c.name}
                  onChangeText={(v) => updateContact(i, 'name', v)}
                />
                <TextInput
                  style={[styles.contactInput, { backgroundColor: theme.colors.midnight, color: theme.colors.ivory }]}
                  placeholder="Phone number"
                  placeholderTextColor={theme.colors.ash}
                  value={c.phone}
                  onChangeText={(v) => updateContact(i, 'phone', v)}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={[styles.contactInput, { backgroundColor: theme.colors.midnight, color: theme.colors.ivory }]}
                  placeholder="Email (for auto SOS alert)"
                  placeholderTextColor={theme.colors.ash}
                  value={c.email}
                  onChangeText={(v) => updateContact(i, 'email', v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </GlassCard>
            ))}
            <PressableGoldButton
              label="Save Contacts"
              onPress={saveContacts}
              icon={<Ionicons name="checkmark-circle" size={18} color={theme.colors.ivory} />}
              style={{ marginTop: 8, marginHorizontal: 0 }}
            />
          </View>
        ) : (
          contacts.filter(c => c.name && c.phone).length > 0 ? (
            contacts.filter(c => c.name && c.phone).map((c, i) => (
              <ContactRow
                key={i}
                icon="person"
                title={c.name}
                number={c.phone}
                subtitle={c.email || undefined}
                onPress={() => callEmergency(c.phone)}
                iconColor={theme.colors.gold}
              />
            ))
          ) : (
            <GlassCard style={styles.emptyContactCard} glowOnPress={false}>
              <Ionicons name="people-outline" size={28} color={theme.colors.ash} />
              <Text style={[theme.typography.body, { color: theme.colors.parchment, marginTop: 8, textAlign: 'center' }]}>
                No emergency contacts yet
              </Text>
              <TouchableOpacity
                style={[styles.addContactBtn, { borderColor: theme.colors.gold }]}
                onPress={() => setEditingContacts(true)}
              >
                <Ionicons name="add" size={16} color={theme.colors.gold} />
                <Text style={[theme.typography.label, { color: theme.colors.gold, marginLeft: 4 }]}>Add Contacts</Text>
              </TouchableOpacity>
            </GlassCard>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ── Get Started ──
  getStartedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  getStartedIcon: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 2,
    overflow: 'hidden',
  },
  getStartedIconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureList: {
    marginTop: 28,
    width: '100%',
    paddingHorizontal: 20,
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },

  // ── SOS Screen ──
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    zIndex: 10,
  },
  subtitle: {
    marginTop: 6,
    textAlign: 'center',
  },

  // ── SOS Button ──
  sosContainer: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 28,
  },
  sosOuterPulse: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    top: -10,
  },
  sosRingWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosSvg: {
    position: 'absolute',
  },
  sosButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  sosText: { marginTop: 4 },
  sosSubtext: { marginTop: 2, fontSize: 10 },
  holdIndicator: {
    alignItems: 'center',
    marginTop: 16,
    width: SCREEN_W * 0.5,
  },
  holdProgressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  holdProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  holdCounter: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },

  // ── Country selector ──
  countrySelector: { marginBottom: 24 },
  countryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },

  // ── Sections ──
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { marginBottom: 16 },

  // ── Contact rows ──
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
  },
  contactIcon: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 14,
  },
  contactInfo: { flex: 1 },
  callBtnCircle: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },

  // ── Medical info ──
  medicalCard: {
    padding: 16,
  },
  medicalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  medicalIconBg: {
    width: 36, height: 36, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  bloodTypeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  notesInput: {
    minHeight: 80,
    paddingTop: 12,
  },

  // ── Service buttons ──
  serviceButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    width: 86,
    height: 90,
    marginRight: 12,
  },

  // ── Contact editing ──
  editContactCard: {
    padding: 16,
    marginBottom: 12,
  },
  contactInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    fontSize: 14,
  },
  emptyContactCard: {
    padding: 24,
    alignItems: 'center',
  },
  addContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
});
