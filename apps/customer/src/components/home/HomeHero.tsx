import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { layout, radius, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface HomeHeroProps {
  paddingTop: number;
  firstName?: string;
  city: string;
  locality?: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HomeHero({ paddingTop, firstName, city, locality }: HomeHeroProps) {
  const greeting = getGreeting();
  const nameLine = firstName ? `${greeting}, ${firstName}` : greeting;

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#063F3B', '#0B6E67', '#0E8F86']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.decor} pointerEvents="none">
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
      </View>

      <View style={[styles.content, { paddingTop: paddingTop + 8 }]}>
        <View style={styles.topRow}>
          <Pressable style={styles.locationBtn}>
            <View style={styles.locIcon}>
              <Ionicons name="location" size={16} color={colors.white} />
            </View>
            <View style={styles.locText}>
              <Text style={styles.deliverTo}>Deliver to</Text>
              <View style={styles.cityRow}>
                <Text style={styles.city}>{city}</Text>
                {locality ? (
                  <Text style={styles.locality} numberOfLines={1}> · {locality}</Text>
                ) : null}
                <Ionicons name="chevron-down" size={13} color="rgba(255,255,255,0.8)" />
              </View>
            </View>
          </Pressable>

          <Pressable style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={21} color={colors.white} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        <Text style={styles.greeting}>{nameLine}</Text>
        <Text style={styles.sub}>What would you like cleaned today?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 44,
    overflow: 'hidden',
    backgroundColor: '#0B6E67',
  },
  decor: {
    position: 'absolute',
    right: -10,
    top: 20,
    width: 160,
    height: 160,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  circle1: { width: 140, height: 140, right: 0, top: 0 },
  circle2: { width: 90, height: 90, right: 70, top: 70 },
  content: {
    paddingHorizontal: layout.pad,
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  locationBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locText: { flex: 1 },
  deliverTo: {
    ...type.caption,
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  city: {
    ...type.body,
    color: colors.white,
    fontWeight: '700',
  },
  locality: {
    ...type.bodySm,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    flexShrink: 1,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    borderWidth: 1.5,
    borderColor: '#0B6E67',
  },
  greeting: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  sub: {
    ...type.body,
    color: 'rgba(255,255,255,0.82)',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
});
