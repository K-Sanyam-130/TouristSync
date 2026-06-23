import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../constants/Categories';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PlaceCard({ place, onPress, index }) {
  const { theme } = useTheme();
  const categoryIcon = CATEGORY_ICONS[place.category] || 'location';
  const categoryColor = CATEGORY_COLORS[place.category] || theme.colors.gold;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const isTopThree = place.rank && place.rank <= 3;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: Math.min(index * 60, 300),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: Math.min(index * 60, 300),
        speed: 14,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  // Press scale
  const pressScale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(pressScale, { toValue: 0.97, speed: 40, bounciness: 4, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(pressScale, { toValue: 1, speed: 14, bounciness: 4, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.card,
          { transform: [{ scale: pressScale }] },
        ]}
      >
        {/* Left: icon circle */}
        <View style={[styles.iconCircle, { backgroundColor: categoryColor + '18', borderColor: categoryColor + '30' }]}>
          <Ionicons name={categoryIcon} size={18} color={categoryColor} />
        </View>

        {/* Center: text content */}
        <View style={styles.textContent}>
          <View style={styles.nameRow}>
            <Text style={[theme.typography.headingS, { color: theme.colors.ivory, fontSize: 15 }]} numberOfLines={1}>
              {place.name}
            </Text>
            {isTopThree && (
              <View style={styles.popularTag}>
                <Ionicons name="flame" size={9} color="#FF6B35" />
              </View>
            )}
          </View>

          <Text style={[theme.typography.body, { color: theme.colors.parchment, fontSize: 12, lineHeight: 17, marginTop: 3 }]} numberOfLines={2}>
            {place.description}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.locationChip}>
              <Ionicons name="location" size={10} color={theme.colors.goldMuted} />
              <Text style={[theme.typography.caption, { color: theme.colors.ash, marginLeft: 2, fontSize: 10 }]} numberOfLines={1}>
                {place.city}, {place.state}
              </Text>
            </View>
          </View>
        </View>

        {/* Right: rank + navigate arrow */}
        <View style={styles.rightSection}>
          {place.rank && (
            <Text style={[styles.rankText, { color: categoryColor }]}>#{place.rank}</Text>
          )}
          <Ionicons name="chevron-forward" size={16} color={theme.colors.ash} style={{ marginTop: 4 }} />
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.65)',
    borderRadius: 14,
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.08)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  popularTag: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
