// screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function ProfileRow({ icon, label, danger }) {
  return (
    <TouchableOpacity style={styles.row}>
      <Ionicons
        name={icon}
        size={20}
        color={danger ? '#ff7a45' : '#ffffff'}
      />
      <Text
        style={[
          styles.rowText,
          danger && { color: '#ff7a45', fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={danger ? '#ff7a45' : '#888'}
        style={{ marginLeft: 'auto' }}
      />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerArea}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* content */}
      <View style={styles.content}>
        {/* avatar + basic info */}
        <View style={styles.avatar} />
        <Text style={styles.name}>Demo User</Text>
        <Text style={styles.email}>demo@example.com</Text>

        {/* stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Travel Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Countries</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>21</Text>
              <Text style={styles.statLabel}>Cities</Text>
            </View>
          </View>
        </View>

        {/* settings rows */}
        <ProfileRow icon="person-outline" label="Account details" />
        <ProfileRow icon="notifications-outline" label="Notifications" />
        <ProfileRow icon="shield-checkmark-outline" label="Privacy & security" />
        <ProfileRow icon="help-circle-outline" label="Help & support" />
        <ProfileRow icon="log-out-outline" label="Log out (demo only)" danger />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050b18' },

  headerArea: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#131b33',
  },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '700' },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffb38a',
    alignSelf: 'center',
  },
  name: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  email: {
    color: '#b0b4c3',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },

  statsCard: {
    backgroundColor: '#161b2b',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  statsTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: '#b0b4c3',
    fontSize: 11,
    marginTop: 4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#252a3f',
  },
  rowText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 10,
  },
});
