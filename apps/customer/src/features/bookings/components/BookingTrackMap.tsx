import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Path, Stop, LinearGradient as SvgGradient } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { mapPositionFromLive } from '../lib/booking.tracking';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface BookingTrackMapProps {
  progress: number;
  live?: boolean;
  liveCoords?: { lat: number; lng: number } | null;
  address?: string;
}

const ROUTE = 'M 36 230 C 90 205, 130 175, 175 150 S 250 105, 295 82';

export function BookingTrackMap({ progress, live, liveCoords, address }: BookingTrackMapProps) {
  const pos = mapPositionFromLive(progress, liveCoords);
  const pulse = useSharedValue(1);
  const scan = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 1600, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 0 }),
      ),
      -1,
    );
    scan.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.linear }), -1);
  }, [pulse, scan]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.5 - pulse.value * 0.18,
  }));

  const pulseOuterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value * 0.75 }],
    opacity: 0.35 - pulse.value * 0.1,
  }));

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scan.value * 280 }],
    opacity: 0.12,
  }));

  const routeLen = 300 * progress;

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 360 320" style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id="mapBg" x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor="#010F0E" />
            <Stop offset="0.45" stopColor="#084F4A" />
            <Stop offset="1" stopColor="#0B6E67" />
          </SvgGradient>
          <SvgGradient id="routeGlow" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FCD34D" />
            <Stop offset="0.5" stopColor="#6EE7B7" />
            <Stop offset="1" stopColor="#12A598" />
          </SvgGradient>
        </Defs>

        <Path d="M0 0 H360 V320 H0 Z" fill="url(#mapBg)" />

        {/* Grid overlay */}
        {[40, 80, 120, 160, 200, 240, 280].map((y) => (
          <Path key={`h-${y}`} d={`M 0 ${y} H 360`} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        ))}
        {[60, 120, 180, 240, 300].map((x) => (
          <Path key={`v-${x}`} d={`M ${x} 0 V 320`} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        ))}

        {/* Decorative roads */}
        <Path d="M 0 160 H360" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <Path d="M 140 0 V320" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <Path d="M 0 240 H220" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />

        {/* Route shadow */}
        <Path
          d={ROUTE}
          stroke="rgba(252,211,77,0.15)"
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={ROUTE}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={ROUTE}
          stroke="url(#routeGlow)"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${routeLen} 300`}
        />

        {/* Destination halo */}
        <Circle cx={295} cy={82} r={34} fill="rgba(18,165,152,0.15)" />
        <Circle cx={295} cy={82} r={22} fill="rgba(110,231,183,0.2)" />
        <Circle cx={295} cy={82} r={9} fill="#6EE7B7" />
      </Svg>

      <Animated.View style={[styles.scanLine, scanStyle]} pointerEvents="none" />

      {/* Map chips */}
      <View style={styles.chipRow}>
        <View style={styles.chip}>
          <Ionicons name="navigate" size={12} color="#6EE7B7" />
          <Text style={styles.chipText}>{live ? 'GPS active' : 'Estimating route'}</Text>
        </View>
        <View style={[styles.chip, styles.chipLive]}>
          <View style={styles.chipDot} />
          <Text style={styles.chipTextLive}>{live ? 'LIVE' : 'SYNC'}</Text>
        </View>
      </View>

      {/* Home pin */}
      <View style={[styles.homePin, { right: '11%', top: '21%' }]}>
        <View style={styles.homeHalo} />
        <View style={styles.homePinHead}>
          <Ionicons name="home" size={14} color={colors.white} />
        </View>
        <View style={styles.homePinTail} />
      </View>

      {/* Partner pulses */}
      <Animated.View
        style={[styles.partnerPulseOuter, pulseOuterStyle, { left: `${pos.x}%`, top: `${pos.y}%` }]}
        pointerEvents="none"
      />
      <Animated.View
        style={[styles.partnerPulse, pulseStyle, { left: `${pos.x}%`, top: `${pos.y}%` }]}
        pointerEvents="none"
      />

      {/* Partner marker */}
      <View style={[styles.partner, { left: `${pos.x}%`, top: `${pos.y}%` }]}>
        <View style={styles.liveTag}>
          <Text style={styles.liveTagText}>PRO</Text>
        </View>
        <View style={styles.partnerBubble}>
          <Ionicons name="bicycle" size={18} color={colors.white} />
        </View>
        <View style={styles.partnerPointer} />
      </View>

      {address ? (
        <View style={styles.addressBar}>
          <Ionicons name="location" size={14} color="#6EE7B7" />
          <Text style={styles.addressText} numberOfLines={1}>
            {address}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#010F0E',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(110,231,183,0.35)',
    zIndex: 1,
  },
  chipRow: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    gap: spacing.xs,
    zIndex: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipLive: {
    backgroundColor: 'rgba(18,165,152,0.35)',
    borderColor: 'rgba(110,231,183,0.4)',
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6EE7B7',
  },
  chipText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
  },
  chipTextLive: {
    fontFamily: fonts.extraBold,
    fontSize: 10,
    color: colors.white,
    letterSpacing: 0.6,
  },
  homePin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 3,
  },
  homeHalo: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(110,231,183,0.15)',
    top: -8,
  },
  homePinHead: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#084F4A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#6EE7B7',
    shadowColor: '#6EE7B7',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  homePinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#084F4A',
    marginTop: -2,
  },
  partnerPulseOuter: {
    position: 'absolute',
    width: 72,
    height: 72,
    marginLeft: -36,
    marginTop: -42,
    borderRadius: 36,
    backgroundColor: 'rgba(252,211,77,0.12)',
    zIndex: 1,
  },
  partnerPulse: {
    position: 'absolute',
    width: 52,
    height: 52,
    marginLeft: -26,
    marginTop: -32,
    borderRadius: 26,
    backgroundColor: 'rgba(18,165,152,0.35)',
    zIndex: 2,
  },
  partner: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -22,
    marginTop: -30,
    zIndex: 5,
  },
  liveTag: {
    position: 'absolute',
    top: -18,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#FCD34D',
  },
  liveTagText: {
    fontFamily: fonts.extraBold,
    fontSize: 8,
    color: '#422006',
    letterSpacing: 0.4,
  },
  partnerBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#12A598',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#12A598',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  partnerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#12A598',
    marginTop: -1,
  },
  addressBar: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    zIndex: 4,
  },
  addressText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
  },
});
