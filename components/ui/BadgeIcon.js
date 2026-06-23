// components/ui/BadgeIcon.js — Reusable badge icon component with premium 3D metal styling
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BADGE_CONFIG = {
  first_trip: {
    rimColors: ['#CD7F32', '#B87333', '#8B5A2B', '#5C3815'], // Bronze
    icon: 'medal-outline',
    glow: 'rgba(205, 127, 50, 0.45)',
    emblemColor: '#E29B5D',
  },
  trail_starter: {
    rimColors: ['#FFFFFF', '#DCDCDC', '#A9A9A9', '#808080'], // Silver
    icon: 'compass-outline',
    glow: 'rgba(224, 224, 224, 0.45)',
    emblemColor: '#E0E0E0',
  },
  explorer: {
    rimColors: ['#FFF8DC', '#FFD700', '#B8860B', '#8B6508'], // Gold
    icon: 'map-outline',
    glow: 'rgba(255, 215, 0, 0.5)',
    emblemColor: '#FFE066',
  },
  adventurer: {
    rimColors: ['#FFE0B2', '#FF9100', '#E65100', '#9E2A00'], // Amber
    icon: 'trophy-outline',
    glow: 'rgba(255, 145, 0, 0.5)',
    emblemColor: '#FFB74D',
  },
  trailblazer: {
    rimColors: ['#F0F8FF', '#B0C4DE', '#778899', '#4682B4'], // Platinum
    icon: 'sparkles-outline',
    glow: 'rgba(229, 228, 226, 0.55)',
    emblemColor: '#E5E4E2',
  },
  globe_trotter: {
    rimColors: ['#E0F7FA', '#00E5FF', '#0097A7', '#006064'], // Diamond/Cyan
    icon: 'globe-outline',
    glow: 'rgba(0, 229, 255, 0.6)',
    emblemColor: '#80DEEA',
  },
  legend: {
    rimColors: ['#F3E5F5', '#E040FB', '#7B1FA2', '#4A0072'], // Crown/Amethyst
    icon: 'ribbon-outline',
    glow: 'rgba(224, 64, 251, 0.6)',
    emblemColor: '#F3E5F5',
  },
  locked: {
    rimColors: ['#555555', '#424242', '#2A2A2A', '#1A1A1A'], // Dark Grey
    icon: 'lock-closed-outline',
    glow: 'transparent',
    emblemColor: '#555555',
  }
};

export default function BadgeIcon({ badgeId, size = 50, locked = false }) {
  const config = locked ? BADGE_CONFIG.locked : (BADGE_CONFIG[badgeId] || BADGE_CONFIG.locked);
  const iconSize = size * 0.44;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer Glow backing for unlocked badges */}
      {!locked && (
        <View 
          style={[
            styles.glow, 
            { 
              backgroundColor: config.glow,
              width: size * 1.08,
              height: size * 1.08,
              borderRadius: (size * 1.08) / 2,
            }
          ]} 
        />
      )}
      
      {/* Outer Metal Rim */}
      <LinearGradient
        colors={config.rimColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.badgeRim, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            padding: size * 0.07, // Outer rim thickness
          }
        ]}
      >
        {/* Inner Core */}
        <LinearGradient
          colors={locked ? ['#262626', '#121212'] : ['#1D1D2C', '#0A0A10']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.innerCore,
            {
              borderRadius: size / 2,
            }
          ]}
        >
          {/* Subtle Ring Accent inside the core */}
          {!locked && (
            <View
              style={{
                position: 'absolute',
                top: 2,
                left: 2,
                right: 2,
                bottom: 2,
                borderRadius: size,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.05)',
              }}
            />
          )}

          {/* Glare Reflection overlay */}
          {!locked && (
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.glare}
            />
          )}

          {/* Main Icon */}
          <Ionicons 
            name={config.icon} 
            size={iconSize} 
            color={locked ? '#4E4E4E' : config.emblemColor} 
            style={styles.icon}
          />

          {/* Bottom Star Accent on high tier achievements */}
          {!locked && ['trailblazer', 'globe_trotter', 'legend'].includes(badgeId) && (
            <Ionicons
              name="star"
              size={size * 0.11}
              color="#FFD700"
              style={styles.starAccent}
            />
          )}
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    opacity: 0.75,
  },
  badgeRim: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 6,
  },
  innerCore: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  glare: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '120%',
    height: '60%',
    transform: [{ rotate: '-30deg' }, { scale: 1.4 }],
  },
  icon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },
  starAccent: {
    position: 'absolute',
    bottom: '8%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  }
});
