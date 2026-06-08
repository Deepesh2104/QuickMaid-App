import { Ionicons } from '@expo/vector-icons';

import * as Haptics from 'expo-haptics';

import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';



import { type Href, useRouter } from 'expo-router';
import { useOpenNotifications } from '@/features/notifications/hooks/useOpenNotifications';
import { HOME_IMAGES } from '../constants/unsplash.images';

import { HomePhoto } from './HomePhoto';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { layout, radius, spacing } from '@/theme/spacing';



interface HomeHeaderProps {

  paddingTop: number;

  firstName?: string;

  city: string;

  locality?: string;

  unreadCount?: number;

}



const STATS = [

  { icon: 'shield-checkmark' as const, value: '4.85★', label: 'Rated' },

  { icon: 'home' as const, value: '50k+', label: 'Homes' },

  { icon: 'flash' as const, value: '98%', label: 'On-time' },

];



function getGreeting() {

  const h = new Date().getHours();

  if (h < 12) return 'Good morning';

  if (h < 17) return 'Good afternoon';

  return 'Good evening';

}



export function HomeHeader({ paddingTop, firstName, city, locality, unreadCount = 0 }: HomeHeaderProps) {
  const router = useRouter();
  const openNotifications = useOpenNotifications();
  const line = firstName ? `${getGreeting()}, ${firstName}` : getGreeting();

  const address = locality ? `${locality}, ${city}` : city;



  return (

    <View style={styles.wrap}>

      <HomePhoto uri={HOME_IMAGES.hero} style={styles.photo} overlay="hero" />



      <View style={[styles.content, { paddingTop: paddingTop + 6 }]}>

        <View style={styles.topBar}>

          <Pressable

            style={styles.glassBtn}

            onPress={() => {
              Haptics.selectionAsync();
              router.push('/(tabs)/profile' as Href);
            }}

            accessibilityRole="button"

            accessibilityLabel={`Location ${address}`}

          >

            <Ionicons name="location" size={15} color={colors.white} />

            <View style={styles.locText}>

              <Text style={styles.locLabel}>Deliver to</Text>

              <Text style={styles.city} numberOfLines={1}>

                {city}

              </Text>

            </View>

            <Ionicons name="chevron-down" size={12} color="rgba(255,255,255,0.85)" />

          </Pressable>



          <Pressable

            style={styles.bell}

            onPress={openNotifications}

            accessibilityLabel="Notifications"

            accessibilityRole="button"

          >

            <Ionicons name="notifications-outline" size={19} color={colors.white} />

            {unreadCount > 0 ? <View style={styles.dot} /> : null}

          </Pressable>

        </View>



        <View style={styles.heroCopy}>

          <Text style={styles.greeting}>{line}</Text>

          <Text style={styles.headline}>

            Your home,{'\n'}

            <Text style={styles.headlineAccent}>spotless</Text> in minutes

          </Text>

        </View>



        <View style={styles.statsGlass} accessibilityRole="summary">

          {STATS.map((s, i) => (

            <View key={s.label} style={[styles.stat, i > 0 && styles.statSep]}>

              <Ionicons name={s.icon} size={13} color="#6EE7B7" />

              <Text style={styles.statValue}>{s.value}</Text>

              <Text style={styles.statLabel}>{s.label}</Text>

            </View>

          ))}

        </View>

      </View>

    </View>

  );

}



const fill: ViewStyle = StyleSheet.absoluteFill;



const styles = StyleSheet.create({

  wrap: {

    minHeight: 296,

    paddingBottom: 36,

    overflow: 'hidden',

  },

  photo: { ...fill },

  content: {

    flex: 1,

    paddingHorizontal: layout.pad,

    justifyContent: 'space-between',

    zIndex: 2,

  },

  topBar: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: spacing.sm,

    marginBottom: spacing.xl,

  },

  glassBtn: {

    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    gap: spacing.sm,

    minWidth: 0,

    backgroundColor: 'rgba(255,255,255,0.14)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.22)',

    borderRadius: radius.pill,

    paddingHorizontal: 14,

    paddingVertical: 10,

  },

  locText: { flex: 1, minWidth: 0 },

  locLabel: {

    fontFamily: fonts.semiBold,

    fontSize: 9,

    letterSpacing: 0.6,

    color: 'rgba(255,255,255,0.72)',

    textTransform: 'uppercase',

  },

  city: {

    fontFamily: fonts.bold,

    fontSize: 14,

    color: colors.white,

    marginTop: 1,

  },

  bell: {

    width: 44,

    height: 44,

    borderRadius: radius.pill,

    backgroundColor: 'rgba(255,255,255,0.14)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.22)',

    alignItems: 'center',

    justifyContent: 'center',

  },

  dot: {

    position: 'absolute',

    top: 11,

    right: 12,

    width: 7,

    height: 7,

    borderRadius: 4,

    backgroundColor: '#FBBF24',

    borderWidth: 1.5,

    borderColor: '#0B6E67',

  },

  heroCopy: { gap: spacing.sm, marginBottom: spacing.lg },

  greeting: {

    fontFamily: fonts.medium,

    fontSize: 14,

    color: 'rgba(255,255,255,0.88)',

  },

  headline: {

    fontFamily: fonts.extraBold,

    fontSize: 32,

    color: colors.white,

    letterSpacing: -1,

    lineHeight: 38,

  },

  headlineAccent: {

    color: '#6EE7B7',

  },

  statsGlass: {

    flexDirection: 'row',

    backgroundColor: 'rgba(255,255,255,0.12)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.2)',

    borderRadius: radius.xl,

    paddingVertical: spacing.md,

  },

  stat: { flex: 1, alignItems: 'center', gap: 2 },

  statSep: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.18)' },

  statValue: {

    fontFamily: fonts.extraBold,

    fontSize: 14,

    color: colors.white,

  },

  statLabel: {

    fontFamily: fonts.semiBold,

    fontSize: 9,

    color: 'rgba(255,255,255,0.72)',

    letterSpacing: 0.3,

  },

});


