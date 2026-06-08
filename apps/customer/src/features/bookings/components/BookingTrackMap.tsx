import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, Path, Stop, LinearGradient as SvgGradient } from 'react-native-svg';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { proMapPosition } from '../lib/booking.tracking';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/spacing';

interface BookingTrackMapProps {
  progress: number;
  address: string;
}

const ROUTE =
  'M 48 210 C 90 190, 120 150, 160 130 S 240 90, 290 78';

export function BookingTrackMap({ progress, address }: BookingTrackMapProps) {
  const pos = proMapPosition(progress);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.35, { duration: 1200 }), -1, true);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 2 - pulse.value,
  }));

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 360 280" style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#E8F5F3" />
            <Stop offset="1" stopColor="#D4EDE8" />
          </SvgGradient>
          <SvgGradient id="route" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#12A598" stopOpacity="0.35" />
            <Stop offset="1" stopColor="#0B6E67" />
          </SvgGradient>
        </Defs>

        <Path d="M0 0 H360 V280 H0 Z" fill="url(#mapBg)" />

        {Array.from({ length: 9 }, (_, i) => (
          <Line
            key={`h-${i}`}
            x1={0}
            y1={i * 32}
            x2={360}
            y2={i * 32}
            stroke="rgba(11,110,103,0.06)"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <Line
            key={`v-${i}`}
            x1={i * 32}
            y1={0}
            x2={i * 32}
            y2={280}
            stroke="rgba(11,110,103,0.06)"
            strokeWidth={1}
          />
        ))}

        <Path d={ROUTE} stroke="url(#route)" strokeWidth={5} fill="none" strokeLinecap="round" />
        <Path
          d={ROUTE}
          stroke="#0B6E67"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${progress * 320} 320`}
        />

        <Circle cx={290} cy={78} r={22} fill="rgba(11,110,103,0.12)" />
        <Circle cx={290} cy={78} r={10} fill="#0B6E67" />
      </Svg>

      <View style={[styles.dest, { right: '12%', top: '22%' }]}>
        <View style={styles.destPin}>
          <Ionicons name="home" size={14} color={colors.white} />
        </View>
        <Text style={styles.destLabel} numberOfLines={1}>
          Your home
        </Text>
      </View>

      <Animated.View
        style={[
          styles.pulse,
          pulseStyle,
          { left: `${pos.x}%`, top: `${pos.y}%` },
        ]}
      />
      <View style={[styles.pro, { left: `${pos.x}%`, top: `${pos.y}%` }]}>
        <View style={styles.proPin}>
          <Ionicons name="bicycle" size={16} color={colors.white} />
        </View>
      </View>

      <View style={styles.zone}>
        <Ionicons name="location-outline" size={12} color={colors.primaryDark} />
        <Text style={styles.zoneText} numberOfLines={1}>
          {address}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 280,
    backgroundColor: '#E8F5F3',
    overflow: 'hidden',
  },
  dest: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
    maxWidth: 100,
  },
  destPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  destLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.primaryDark,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  pulse: {
    position: 'absolute',
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -22,
    borderRadius: 22,
    backgroundColor: 'rgba(11,110,103,0.25)',
  },
  pro: {
    position: 'absolute',
    marginLeft: -18,
    marginTop: -18,
  },
  proPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#12A598',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#084F4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  zone: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    maxWidth: '72%',
  },
  zoneText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
});
